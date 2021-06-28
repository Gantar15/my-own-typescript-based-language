
import Lexer from "./Lexer";
import Parser from "./Parser";

const lxr = new Lexer(
    `сумма РАВНО 5 + 9;
     val = 0 - 6 * 4;
     ВЫВОД сумма;
     >> val;
     ВЫВОД (сумма - ( val + 3 ) + 1)/3;`);

const tokens = lxr.lexAnalis();
const parser = new Parser(tokens);
const AST = parser.parseCode();
parser.execute(AST);