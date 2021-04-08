import { IInputHandler } from "../input/input-handler.interface";
import { IFileFilter } from "./file-filter.interface";

export class FileFilter implements IFileFilter{
    
    private inputReader: any;
    

    constructor(inputReader: IInputHandler) {
        this.inputReader = inputReader;
    }
    getFileFilter(): string {
        return this.inputReader.getInput();
    }
    isFileExtensionValid(extension: string): boolean {
        throw new Error("Method not implemented.");
    }
    
}