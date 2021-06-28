import Token from "./Token";
import { tokenTypeList } from './TokenType';

export default class Lexer {

    pos: number = 0;
    tokenList: Token[] = [];

    constructor(public code: string){}

    lexAnalis(): Token[]{
        while(this.nextToken()){}

        this.tokenList = this.tokenList.filter(token => token.type.name !== tokenTypeList.SPACE.name);
        return this.tokenList;
    }

    nextToken(): boolean{
        if(this.pos >= this.code.length){
            return false;
        }

        const tokenTypeValues = Object.values(tokenTypeList);
        for(const tokenType of tokenTypeValues) {
            const regex = new RegExp('^' + tokenType.regex);
            const result = this.code.slice(this.pos).match(regex);
            if(result && result[0]){
                const token = new Token(tokenType, result[0], this.pos);
                this.pos += result[0].length;
                this.tokenList.push(token);
                return true;
            }
        }
        throw new Error(`Ошибка на позиции ${this.pos}`);
    }
}