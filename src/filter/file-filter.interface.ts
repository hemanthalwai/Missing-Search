export interface IFileFilter{
    
 	getFileFilter(): string
 	isFileExtensionValid(extension: string): boolean
}
