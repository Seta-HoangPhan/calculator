import { Operator, Parenthesis } from "../types";

interface Validate {
  isValid: boolean;
  result?: string;
  err?: string;
}

export const validateExpression = (val: string): Validate => {
  const tokens = convertTokens(val);
  console.log("check12 convert", tokens);

  if (typeof tokens === "string") {
    return {
      isValid: false,
      err: tokens,
    };
  }

  const result = validate(tokens);
  if (typeof result === "string") return { isValid: false, err: result };

  return {
    isValid: true,
    result: result.toString(),
  };
};

interface Token {
  type: "number" | "mathOperator" | Parenthesis;
  value: string;
}

const mathOperators: string[] = [
  Operator.Plus,
  Operator.Times,
  Operator.Devided,
];

const isMathOperatorWithoutMinus = (val: string) => mathOperators.includes(val);

const convertTokens = (val: string): Token[] | string => {
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
      tokens.push({ type: "mathOperator", value: char });
    }

    if (char === Operator.Minus) {
      let minusCount = 1;
      while (val[i + 1] === Operator.Minus) {
        minusCount++;
        ++i;
      }

      tokens.push({
        type: "mathOperator",
        value: minusCount % 2 === 0 ? Operator.Plus : Operator.Minus,
      });
    }

    const decimalRegex = /^[0-9.%]$/;
    if (decimalRegex.test(char)) {
      let num = char;
      while (decimalRegex.test(val[i + 1])) {
        num += val[++i];
      }

      if (num.charAt(num.length - 1) === "%") {
        num = (Number(num.slice(0, -1)) / 100).toString();
      }

      if (isNaN(Number(num))) {
        return "invalid number";
      }

      if (num.charAt(0) === ".") {
        num = `0${num}`;
      }

      if (num.charAt(num.length - 1) === ".") {
        num = num.slice(0, -1);
      }

      tokens.push({ type: "number", value: num });
    }

    i++;
  }

  if (tokens.length > 1 && tokens[1].type === "number") {
    if (tokens[0].value === Operator.Minus) {
      tokens.splice(0, 2, {
        type: "number",
        value: `-${tokens[1].value}`,
      });
    }

    if (tokens[0].value === Operator.Plus) {
      tokens.shift();
    }
  }

  return tokens;
};

const validate = (tokens: Token[]) => {
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
        return "invalid expression";
      }

      const result = calculateExpression(copyTokens.slice(openIndex + 1, i));
      if (result === null) {
        return "invalid expression";
      }

      copyTokens.splice(openIndex, i - openIndex + 1, {
        type: "number",
        value: result.toString(),
      });
      i = openIndex;
    }

    const prevToken = copyTokens[i - 1];
    const nextToken = copyTokens[i + 1];

    if (token.type === "number") {
      if (
        (prevToken &&
          (prevToken.type === "number" ||
            prevToken.type === Parenthesis.Close)) ||
        (nextToken &&
          (nextToken.type === "number" || nextToken.type === Parenthesis.Open))
      ) {
        return "invalid expression";
      }
    }

    // if (token.type === "mathOperator") {
    //   const isMinus = token.value === Operator.Minus;

    //   if (
    //     !nextToken ||
    //     nextToken.type === Parenthesis.Close ||
    //     nextToken.type === "mathOperator"
    //   ) {
    //     return "invalid expression";
    //   }

    //   if (
    //     !isMinus &&
    //     (!prevToken ||
    //       prevToken.type === "mathOperator" ||
    //       prevToken.type === Parenthesis.Open)
    //   ) {
    //     return "invalid expression";
    //   }
    // }
  }

  if (OpenStack.length > 0) {
    return "invalid expression";
  }

  const result = calculateExpression(copyTokens);
  if (result === null) {
    return "invalid expression";
  }

  return result;
};

const calculateExpression = (tokens: Token[]) => {
  const length = tokens.length;
  if (length === 0) return 0;

  if (length === 1) {
    return tokens[0].type === "mathOperator" ? null : Number(tokens[0].value);
  }

  if (tokens[0].value === Operator.Minus && tokens[1].type === "number") {
    tokens.splice(0, 2, {
      type: "number",
      value: `-${tokens}`,
    });
  }

  for (let i = 0; i <= length - 1; i++) {
    const token = tokens[i];
    const isInvalid =
      (i === length - 1 && token.type === "mathOperator") ||
      (i % 2 === 0 && token.type === "mathOperator") ||
      (i % 2 === 1 && token.type === "number");

    if (isInvalid) {
      return null;
    }
  }

  const expression = tokens.map(({ value }) => value).join(" ");
  return Number(eval(expression));
};
