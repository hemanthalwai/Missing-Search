interface IVariableMapping{

    /**
     * getValue
key: string : string    */
    getValue(key: string): string;
    setValue(key: string, value: string): void;
    replaceVariableWithValues(html: string): string;
}