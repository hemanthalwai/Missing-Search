import * as vscode from 'vscode';
import { threadId } from 'worker_threads';
import { IFileSystem } from '../filesystem/filesystem.interface';
import * as path  from 'path';
export class ViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'missing-search-view-input';

	private _view?: vscode.WebviewView;
	constructor(
        private readonly extensionUri: string,
        private readonly iVariableMapping: IVariableMapping,
        private readonly iFileSystem: IFileSystem
	) { 
        this.iVariableMapping = iVariableMapping;
		this.iFileSystem = iFileSystem;
		this.extensionUri = extensionUri;
    }

	public async resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			// localResourceRoots: [
			// 	this.extensionUri
			// ]
		};

		webviewView.webview.html = await this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(data => {
			switch (data.type) {
				case 'colorSelected':
					{
						vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`#${data.value}`));
						break;
					}
			}
		});
	}

	public addColor() {
		if (this._view) {
			this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
			this._view.webview.postMessage({ type: 'addColor' });
		}
	}

	public clearColors() {
		if (this._view) {
			this._view.webview.postMessage({ type: 'clearColors' });
		}
	}

	public async _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.file(path.join(this.extensionUri, 'assets', 'js', 'myscript.js')));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.file( path.join(this.extensionUri, 'assets', 'media', 'reset.css')));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.file(path.join(this.extensionUri, 'assets', 'media', 'vscode.css')));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.file(path.join(this.extensionUri, 'assets', 'media', 'main.css')));
        this.iVariableMapping.setValue('styleResetUri', styleResetUri.toString());
        this.iVariableMapping.setValue('styleVSCodeUri', styleVSCodeUri.toString());
		this.iVariableMapping.setValue('styleMainUri', styleMainUri.toString());
		this.iVariableMapping.setValue('scriptUri', scriptUri.toString());
		this.iVariableMapping.setValue('cspSource', webview.cspSource);

		// Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();
		this.iVariableMapping.setValue('nonce', nonce);
        const indexHtml = (vscode.Uri.file(path.join(this.extensionUri, 'assets', 'index.html')));
        let htmlContent = await this.iFileSystem.getFileContent(indexHtml.fsPath.toString());
        htmlContent = this.iVariableMapping.replaceVariableWithValues(htmlContent);
        return htmlContent;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}