import type { ReactNode } from "react";

export enum Parenthesis {
  Open = "(",
  Close = ")",
}

export enum Operator {
  Plus = "+",
  Minus = "-",
  Times = "*",
  Devided = "/",
  Percent = "%",
}

export enum Action {
  DeleteAll = "AC",
  Delete = "DEL",
  Decimal = ".",
}

export type KeyBoard = Parenthesis | Operator | number | Action;

export enum TokenType {
  Number = "number",
  MathOperator = "mathOperator",
}

export interface Token {
  type: TokenType | Parenthesis;
  value: string;
}

export interface Input {
  key: KeyBoard;
  label: ReactNode;
  isNumber?: boolean;
}

export interface History {
  expression: string;
  result: string;
}
