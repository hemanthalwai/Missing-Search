export class CommandRegistrar{

    private commandCallbacks: { [key: string]: any} = { };

    private readonly vscode: any = null;
    private readonly context: any = null;

    constructor(vscode: any, context: any) {
        this.vscode = vscode;
        this.context = context;
    }
    public registerCommand(command: string, callback: (params: any[]) => any): void {
        try{
            const disposableCallback = this.vscode.commands.registerCommand(command, callback);
            if(this.commandCallbacks[`${command}`] != null ) {
                // this.context.subscriptions.   
            }
            this.context.subscriptions.push(disposableCallback);
            this.commandCallbacks[`${command}`] = callback;
        }
        catch(err) {
            console.log(err);
        }
    };

    public unregisterCommand(command: string): void {
        this.commandCallbacks[`${command}`] = null;
    }
}

