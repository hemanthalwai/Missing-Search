import { IInputHandler } from "./input-handler.interface";

export class InputHandler implements IInputHandler{
    inputReader: any;

    constructor(inputReader: any) {
        this.inputReader = inputReader;
    }
    async getInput(): Promise<string> {
        return new Promise((data)=> console.log(data));
    }
    
}