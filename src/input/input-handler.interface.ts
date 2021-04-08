export interface IInputHandler{
    
    inputReader: any;
	
 	getInput(): Promise<string>
}