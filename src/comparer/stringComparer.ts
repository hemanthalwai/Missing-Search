import { IComparer } from "./comparer.interface";

export class StringComparer implements IComparer{

    contains(content: string, textToSearch: string, regEx: string): boolean {
        return true;
    }
    
  
}
