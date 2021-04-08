class InputTrigger{
    statusBarItem: any;
    command: string;
    callback: any;
    /**
     *
     */
    constructor(statusBarItem: any, command: string, callback = (): void => {}) {
        this.statusBarItem = statusBarItem;
        this.command = command;
        // this.callback = callback;

    }
}