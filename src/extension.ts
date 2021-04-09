// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { MissingSearchDataProvider } from './comparer/treeDataProvider';
import {ViewProvider} from './view/view-provider';
import { HtmlVariableMapping } from './mapping/html-variable-mapping';
import { FileSystem } from './filesystem/filesystem';
import * as fs  from "fs";
import { FileFilter } from './filter/file-filter';
import { rgPath } from 'vscode-ripgrep';
import * as cp from 'child_process';
import { StringDecoder } from 'string_decoder';
import { resolve } from 'dns';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
 
export async function activate(context: vscode.ExtensionContext) {

	const iVariableMapping = new HtmlVariableMapping();
	const ab  = rgPath;
	const statusBarTriggerCommand = 'missing-search.statusbar-trigger';
	const title = `Missing Search`;
	var panel: vscode.WebviewPanel;
	context.subscriptions.push(vscode.commands.registerCommand(statusBarTriggerCommand, async () => {
		// vscode.window.showInformationMessage(`Triggered Search... Keep going!`);
		callback();
	}));

	const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	myStatusBarItem.command = statusBarTriggerCommand;
	myStatusBarItem.text = `$(search-view-icon) ${title}`;
	myStatusBarItem.show();
	context.subscriptions.push(myStatusBarItem);

	const iFileSystem = new FileSystem(fs);
	const provider = new ViewProvider(context.extensionPath, iVariableMapping, iFileSystem);
	
	// type {searchText: string, condition: string, specialCondition: string, operator: string}
	const callback1 = async(item: any) => {
		return new Promise((resolve) => {
			const params: string[] = [];
			params.push('-t md'); // specifies file type extensions
			params.push('--json')
			if(item.condition === 'MISSING'){
				const conditionString = '--files-without-match';
				params.push(conditionString);
			}
			let isRegex = false;
			let caseSensitiveString = null;
			switch(item.specialCondition){
				case 'MATCH_CASE':
					caseSensitiveString =  '--case-sensitive';
					break;
				case 'MATCH_WHOLE_WORD':
					params.push('--regexp', `/\b${item.searchText}\b/`);
					isRegex = true;
					break;
				default:
					caseSensitiveString = '--ignore-case';
			}
			if(caseSensitiveString)
				params.push(caseSensitiveString);
			if(!isRegex){
				params.push('--');
				params.push(`${item.searchText}`);
			}
			params.push('E:\\Personal\\Repo\\vsCodeExtensions\\Missing-Search\\sample');
			const t2 = cp.spawn(ab, params,  {shell: true });
			const stringDecoder = new StringDecoder();
			const resultArray: string[] = [];
			t2.on('error', (err)=>{
				console.log(err);
				t2.kill();
			});
			t2.on('result', (res: Buffer) => {
				const resStr = res.toString('utf8');
				console.log(resStr);
				t2.kill();
			});
			t2.stdout!.on('data', (data) =>{
				const resStr = data.toString('utf8');
				console.log(resStr);
				resultArray.push(resStr);
				t2.kill();
	
			});
			t2.stdout!.once('data', (data) =>{
				t2.kill();
			});
			t2.stderr!.on('data', (data) =>{
				const res = stringDecoder.write(data)
				console.log(res);
				t2.kill();
			});
			t2.on('close', (code) => {
				console.log('closing code', code);
				// tslint:disable-next-line
				// getPanel().webview.postMessage({resultArray});
				resolve(resultArray.join(''));
			})	
		});
		
	}
	function getPanel() { 
		return panel;
	}
	function setPanel(parampanel: any) {
		panel = parampanel;
	}
	
	const callback = async () => {
	panel = vscode.window.createWebviewPanel(
		"configView",
		"Missing Search",
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'assets'))]
		}
	);
	setPanel(panel);
	panel.webview.html = await provider._getHtmlForWebview(panel.webview);
	panel.webview.onDidReceiveMessage(async msg => {
		// console.log(`Received data `, msg);
		const {data}  = msg;
		const promises: Promise<any>[] = [];
		data.forEach((x: any) => {
			const p1 = callback1(x);
			promises.push(p1);
			});
		await Promise.all(promises).then(results => {
			const formattedResult: any = []
			console.log(results);
			const returnDataType = ['begin','match'];
			results.forEach(x => {
				const result = x.split('\n').map((y:any) => JSON.parse(y || null)).filter((item:any) => returnDataType.includes(item?.type));
				formattedResult.push(result);
			});
			console.log(JSON.stringify(formattedResult));
			getPanel().webview.postMessage({resultArray: formattedResult});
		});
	}, undefined, context.subscriptions);
	// provider.addColor();
	// panel.webview.html = `${panel.webview.asWebviewUri(vscode.Uri.file('../assets/index.html'))}`;
	};


	// const ttemp2 = vscode.extensions.getExtension("vscode.search-result");
	//search.action.openResultToSide
	// const ttemp3 = await vscode.commands.executeCommand('workbench.action.openResultToSide');
	// const ttemp1 = await vscode.commands.executeCommand('workbench.action.findInFiles', {
	// 	isRegex: false,
	// 	pattern: 'files-without-match -- test',
	// 	triggerSearch: true,
	// 	matchWholeWord: false
	// });
	
	// export interface IFindInFilesArgs {
	// 	query?: string;
	// 	replace?: string;
	// 	triggerSearch?: boolean;
	// 	filesToInclude?: string;
	// 	filesToExclude?: string;
	// 	isRegex?: boolean;
	// 	isCaseSensitive?: boolean;
	// 	matchWholeWord?: boolean;
	// }
	// const t3 = await vscode.commands.executeCommand('search.action.openInEditor');
	// console.log(ttemp1);

	// context.subscriptions.push(
	// 	vscode.window.registerWebviewViewProvider(ViewProvider.viewType, provider));

	// 	context.subscriptions.push(
	// 		vscode.commands.registerCommand('MissingSearch.helloWorld', () => {
	// 			provider.addColor();
	// 		}));
	
	// const dirName2 = (Array.isArray(vscode.workspace.workspaceFolders)) ? vscode.workspace.workspaceFolders[0].name : '';
	// const input  = vscode.window.createInputBox();
	// input.placeholder = 'Enter string';
	// input.show();
	// // vscode.window.
	// vscode.window.createTreeView('missing-search-view', {
	// 	treeDataProvider: new MissingSearchDataProvider(dirName2)
	//   });
	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('MissingSearch.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 		const workspaceFolders = vscode.workspace.workspaceFolders; 
	// 		if(workspaceFolders && Array.isArray(workspaceFolders)){
	// 			const rootPath = workspaceFolders[0].uri.fsPath;
	// 			new StringCompare(null, rootPath);

	// 		}
	// 		vscode.window.showInformationMessage(`Hello from Missing Search!`);
	// });

	// let displayTime = vscode.commands.registerCommand('MissingSearch.displayTime', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage(new Date().toUTCString());
	// });
	// let keyPressEvent = vscode.commands.registerTextEditorCommand('MissingSearch.keyPressEvent', (textEditor, edit) => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage(new Date().toUTCString());
	// });
	// context.subscriptions.push(disposable);
	// context.subscriptions.push(displayTime);
	// context.subscriptions.push(keyPressEvent);

}

// this method is called when your extension is deactivated
export function deactivate() {}
