export interface IFileSystem{
    
    filesystem: any;
	fileFilter: any;

	isDirectory(path: string ): Promise<boolean>
	isFile(path: string ): Promise<boolean>
	getFiles(path: string ): Promise<string[]>
	getFileContent(path: string ): Promise<string>
	getFileStats(path: string ): Promise<any>
	
}