import * as errMsg from "../constants/error";
import { Parenthesis, TokenType, type Token } from "../types";
import { convertTokens } from "./convertTokens";

interface Validate {
  isValid: boolean;
  result?: string;
  err?: string;
}

export const validateExpressionString = (val: string): Validate => {
  const tokens = convertTokens(val);

  if (typeof tokens === "string") {
    return {
      isValid: false,
      err: tokens,
    };
  }

  const result = validateTokens(tokens);
  if (typeof result === "string") return { isValid: false, err: result };

  return {
    isValid: true,
    result: result.toString(),
  };
};

const validateTokens = (tokens: Token[]) => {
  const copyTokens = [...tokens];
  const OpenStack: number[] = [];

  for (let i = 0; i <= copyTokens.length - 1; i++) {
    const token = copyTokens[i];

    if (token.type === Parenthesis.Open) {
      OpenStack.push(i);
    }

    if (token.type === Parenthesis.Close) {
      const openIndex = OpenStack.pop();
      if (openIndex === undefined) {
        return errMsg.REDUNDANT_CLOSE;
      }

      const result = calExpressionTokens(copyTokens.slice(openIndex + 1, i));
      if (result === null) {
        return errMsg.INVALID_EXPRESSION;
      }

      copyTokens.splice(openIndex, i - openIndex + 1, {
        type: TokenType.Number,
        value: result.toString(),
      });

      i = openIndex;
    }
  }

  if (OpenStack.length > 0) {
    return errMsg.REDUNDANT_OPEN;
  }

  const result = calExpressionTokens(copyTokens);
  if (result === null) {
    return errMsg.INVALID_EXPRESSION;
  }

  return result;
};

const calExpressionTokens = (tokens: Token[]) => {
  const length = tokens.length;
  if (length === 0) return 0;

  if (length === 1) {
    return tokens[0].type === TokenType.MathOperator
      ? null
      : Number(tokens[0].value);
  }

  for (let i = 0; i <= length - 1; i++) {
    const token = tokens[i];
    const isInvalid =
      (i === length - 1 && token.type === TokenType.MathOperator) ||
      (i % 2 === 0 && token.type === TokenType.MathOperator) ||
      (i % 2 === 1 && token.type === TokenType.Number);

    if (isInvalid) {
      return null;
    }
  }

  const expression = tokens.map(({ value }) => value).join(" ");
  return Number(eval(expression));
};
