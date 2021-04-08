export class HtmlVariableMapping implements IVariableMapping{
   
    static htmlVariables: {[key: string] : string} = {
        'styleResetUri': '',
        'styleVSCodeUri': '',
        'styleMainUri': '',
        'scriptUri': '',
        'nonce': '',
        'cspSource': ''
    } 
    
    getValue(key: string): string {
        return HtmlVariableMapping.htmlVariables[key] || '';
    }

    setValue(key: string, value: string): void {
        HtmlVariableMapping.htmlVariables[key] = value;
    }
   
    replaceVariableWithValues(html: string): string {
        for (const [key, value] of Object.entries(HtmlVariableMapping.htmlVariables)){
            while(html.includes('${' + key + '}')) 
            html = html.replace('${' + key + '}', value);
        }
        return html;
    }
   
}