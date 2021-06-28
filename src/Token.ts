import TokenType from './TokenType';


export default class Token{
    public type: TokenType;
    public text: string;
    public pos: number;

    constructor(type: TokenType, text: string, pos: number){
        this.type = type;
        this.text = text;
        this.pos = pos;
    }
}