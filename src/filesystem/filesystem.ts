import { rejects } from "assert";
import { resolve } from "dns";
import { IFileFilter } from "../filter/file-filter.interface";
import { IFileSystem } from "./filesystem.interface";

export class FileSystem implements IFileSystem{
    
    filesystem: any;
    fileFilter: any;

    constructor(filesystem: any, fileFilter?: IFileFilter) {
        this.filesystem = filesystem;
        this.fileFilter = fileFilter;
    }

    async isDirectory(path: string): Promise<boolean> {
        const fileStats = await this.getFileStats(path);
        return fileStats.isDirectory();
    }
    async isFile(path: string): Promise<boolean> {
        const fileStats = await this.getFileStats(path);
        return fileStats.isFile();
    }

    async getFiles(path: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            try{
                const fileNames = this.filesystem.readdirSync(path);
                resolve(fileNames);
            } catch(err){
                reject(err);
            }
        });
    }

    async getFileContent(path: string): Promise<string> {
        const filename = path; //path.split('\\');
        const readStream  = await this.filesystem.createReadStream(filename, { encoding: 'utf8', autoClose: true});
        let data = '';    
        return new Promise((resolve, reject) => {
            readStream.on('data', (chunk: string) =>{
                    data += chunk;
                }).on('end', () => {
                    resolve(data);
                }).on('error', (err: string) => reject(err));
        });
    }

    async getFileStats(path: string): Promise<any> {
        try{
            return this.filesystem.lstatSync(path);
        } catch(err){
            throw err;
        }
    }
    
}