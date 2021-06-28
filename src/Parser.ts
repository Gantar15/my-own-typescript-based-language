import BinOperationNode from "./AST/BinOperationNode";
import ExpressionNode from "./AST/ExpressionNode";
import NumberNode from "./AST/NumberNode";
import StatementsNode from "./AST/StatementsNode";
import UnarOperationNode from "./AST/UnarOperationNode";
import VariableNode from "./AST/VariableNode";
import Token from "./Token";
import TokenType, { tokenTypeList } from "./TokenType";

export default class Parser {
    tokens: Token[];
    pos: number = 0;
    scope: any = {};

    constructor(tokens: Token[]){
        this.tokens = tokens;
    }

    match(...expected: TokenType[]): Token | null {
        if(this.pos < this.tokens.length){
            const currentToken = this.tokens[this.pos];
            if(expected.find(type => type.name === currentToken.type.name)){
                this.pos++;
                return currentToken;
            }
        }
        return null;
    }

    require(...expected: TokenType[]): Token {
        const token = this.match(...expected);
        if(!token){
            throw new Error(`На позиции ${this.pos} ожидается ${expected[0].name}`);
        }
        return token;
    }

    parseVariableOrNumber(): ExpressionNode{
        const number = this.match(tokenTypeList.NUMBER);
        if(number != null){
            return new NumberNode(number);
        }
        const variable = this.match(tokenTypeList.VARIABLE);
        if(variable != null){
            return new VariableNode(variable);
        }
        throw new Error(`На позиции ${this.pos} ожидалось число или переменная`);
    }

    parsePrint(): ExpressionNode{
        const tokenLog = this.match(tokenTypeList.LOG);
        if(tokenLog != null){
            return new UnarOperationNode(tokenLog, this.parseFormula());
        }
        throw new Error(`Ожидался унарный оператор на позиции ${this.pos}`);
    }

    parseParentheses(): ExpressionNode{
        if(this.match(tokenTypeList.LPAR) != null){
            const node = this.parseFormula();
            this.require(tokenTypeList.RPAR);
            return node;
        } else{
            return this.parseVariableOrNumber();
        }
    }

    parseFormula(): ExpressionNode{
        let leftNode = this.parseParentheses();
        let operator = this.match(tokenTypeList.PLUS, tokenTypeList.MINUS, 
                                        tokenTypeList.DIVIDE, tokenTypeList.MULTIPLY);
        while(operator != null){
            const rightNode = this.parseParentheses();
            leftNode = new BinOperationNode(operator, leftNode, rightNode);
            operator = this.match(tokenTypeList.PLUS, tokenTypeList.MINUS, 
                                        tokenTypeList.DIVIDE, tokenTypeList.MULTIPLY);
        }
        return leftNode;
    }

    parseExpression(): ExpressionNode{
        if(this.match(tokenTypeList.VARIABLE) == null){
            const printNode = this.parsePrint();
            return printNode;
        }
        --this.pos;
        const variableNode = this.parseVariableOrNumber();
        const assignOperator = this.match(tokenTypeList.ASSIGN);
        if(assignOperator != null){
            const rightFormulaNode = this.parseFormula();
            const binaryNode = new BinOperationNode(assignOperator, variableNode, rightFormulaNode);
            return binaryNode;
        }
        throw new Error(`После переменной ожидается оператор присваивания на позиции ${this.pos}`);
    }

    parseCode(): ExpressionNode{
        const root = new StatementsNode();
        while(this.pos < this.tokens.length){
            const codeStringNode = this.parseExpression();
            this.require(tokenTypeList.SEMICOLON);
            root.addNode(codeStringNode);
        }
        return root;
    }

    execute(node: ExpressionNode): any {
        if(node instanceof NumberNode){
            return parseInt(node.number.text);
        } 
        else if(node instanceof UnarOperationNode){
            switch(node.operator.type.name){
                case tokenTypeList.LOG.name:
                    console.log(this.execute(node.operand));
                    return;
            }
        }
        else if(node instanceof BinOperationNode){
            switch(node.operator.type.name){
                case tokenTypeList.PLUS.name:
                    return this.execute(node.leftNode) + this.execute(node.rightNode);
                case tokenTypeList.MINUS.name:
                    return this.execute(node.leftNode) - this.execute(node.rightNode);
                case tokenTypeList.DIVIDE.name:
                    return this.execute(node.leftNode) / this.execute(node.rightNode);
                case tokenTypeList.MULTIPLY.name:
                    return this.execute(node.leftNode) * this.execute(node.rightNode);
                case tokenTypeList.ASSIGN.name:
                    const result = this.execute(node.rightNode);
                    const variableNode = node.leftNode as VariableNode;
                    this.scope[variableNode.variable.text] = result;
                    return result;
            }
        }
        else if(node instanceof VariableNode){
            if(this.scope[node.variable.text]){
                return this.scope[node.variable.text];
            }
            throw new Error(`Переменная ${node.variable.text} используется до инициализации`);
        }
        else if(node instanceof StatementsNode){
            node.codeStrings.forEach(codeString => this.execute(codeString));
            return;
        }
        throw new Error('Ошибка!!!');
    }
}