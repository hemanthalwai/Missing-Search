import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class MissingSearchDataProvider implements vscode.TreeDataProvider<Dependency> {
    constructor(private workspaceRoot: string | undefined) {}
    onDidChangeTreeData?: vscode.Event<Dependency | void | null | undefined> | undefined;
    getTreeItem(element: Dependency): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: Dependency): vscode.ProviderResult<Dependency[]> {
        if(!element){
            const data = [];
            for(let i =0; i < 10 ;i++){
                const temp = new Dependency(`Label${i}`, `v.${i}`, vscode.TreeItemCollapsibleState.Collapsed);
                data.push(temp);
            }
            return Promise.resolve(data);
        }
        else{
            return Promise.resolve([]);
        }
    }

}

class Dependency extends vscode.TreeItem {
    constructor(
      public readonly label: string,
      private version: string,
      public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
      super(label, collapsibleState);
      this.tooltip = `${this.label}-${this.version}`;
      this.description = this.version;
    }
  
    // iconPath = {
    //   light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    //   dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    // };
  }