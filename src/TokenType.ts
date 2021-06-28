
export default class TokenType{
    name: string;
    regex: string;

    constructor(name: string, regex: string){
        this.name = name;
        this.regex = regex;
    }
}

export const tokenTypeList = {
    NUMBER: new TokenType('NUMBER', '[0-9]+'),
    VARIABLE: new TokenType('VARIABLE', '[а-яa-z]+'),
    SEMICOLON: new TokenType('SEMICOLON', ';'),
    SPACE: new TokenType('SPACE', '[ \\t\\n\\r]'),
    ASSIGN: new TokenType('ASSIGN', '(=|(РАВНО))'),
    LOG: new TokenType('LOG', '(>>|(ВЫВОД))'),
    PLUS: new TokenType('PLUS', '(\\+|(ПЛЮС))'),
    MINUS: new TokenType('MINUS', '(-|(МИНУС))'),
    DIVIDE: new TokenType('DIVIDE', '(/|(РАЗДЕЛИТЬ))'),
    MULTIPLY: new TokenType('MULTIPLY', '(\\*|(УМНОЖИТЬ))'),
    LPAR: new TokenType('LPAR', '\\('),
    RPAR: new TokenType('RPAR', '\\)')
};