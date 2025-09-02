import * as errMsg from "../constants/error";
import { Operator, Parenthesis, TokenType, type Token } from "../types";

const mathOperators: string[] = [
  Operator.Plus,
  Operator.Times,
  Operator.Devided,
];

const isMathOperatorWithoutMinus = (val: string) => mathOperators.includes(val);

export const convertTokens = (val: string): Token[] | string => {
  const tokens: Token[] = [];
  let i = 0;

  while (i < val.length) {
    const char = val[i];

    if (char === Parenthesis.Open) {
      tokens.push({ type: Parenthesis.Open, value: char });
    }

    if (char === Parenthesis.Close) {
      tokens.push({ type: Parenthesis.Close, value: char });
    }

    if (isMathOperatorWithoutMinus(char)) {
      tokens.push({ type: TokenType.MathOperator, value: char });
    }

    if (char === Operator.Minus) {
      let minusCount = 1;
      while (val[i + 1] === Operator.Minus) {
        minusCount++;
        ++i;
      }

      tokens.push({
        type: TokenType.MathOperator,
        value: minusCount % 2 === 0 ? Operator.Plus : Operator.Minus,
      });
    }

    const decimalRegex = /^[0-9.%]$/;
    if (decimalRegex.test(char)) {
      let num = char;
      while (decimalRegex.test(val[i + 1])) {
        num += val[++i];
      }

      if (isNaN(Number(num))) {
        return errMsg.INVALID_NUMBER;
      }

      if (num.charAt(0) === ".") {
        num = `0${num}`;
      }

      if (num.charAt(num.length - 1) === "%") {
        num = (Number(num.slice(0, -1)) / 100).toString();
      } else if (num.charAt(num.length - 1) === ".") {
        num = num.slice(0, -1);
      }

      tokens.push({ type: TokenType.Number, value: num });
    }

    i++;
  }

  for (let j = 0; j <= tokens.length - 1; j++) {
    const token = tokens[j];
    const prevToken = tokens[j - 1];

    if (j === 0 || (prevToken && prevToken.value === Parenthesis.Open)) {
      if (token.value === Operator.Minus) {
        tokens.splice(j, 2, {
          type: TokenType.Number,
          value: `-${tokens[j + 1].value}`,
        });
      }

      if (token.value === Operator.Plus) {
        tokens.splice(j, 1);
      }
    }
  }

  return tokens;
};
