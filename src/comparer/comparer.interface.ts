export interface IComparer{
	contains(content: string, textToSearch: string, regEx: string): boolean
}
