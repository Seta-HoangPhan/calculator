import {
  faDivide,
  faMinus,
  faPercent,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Action, Operator, Parenthesis, type Input } from "../types";

export const InputList: Input[] = [
  //row 1
  {
    key: Action.DeleteAll,
    label: <strong>{Action.DeleteAll}</strong>,
  },
  {
    key: Parenthesis.Open,
    label: Parenthesis.Open,
  },
  {
    key: Parenthesis.Close,
    label: Parenthesis.Close,
  },
  {
    key: Action.Delete,
    label: Action.Delete,
  },

  // row 2
  {
    key: 7,
    label: <strong>7</strong>,
    isNumber: true,
  },
  {
    key: 8,
    label: <strong>8</strong>,
    isNumber: true,
  },
  {
    key: 9,
    label: <strong>9</strong>,
    isNumber: true,
  },
  {
    key: Operator.Devided,
    label: <FontAwesomeIcon size="xs" icon={faDivide} />,
  },

  // row 3
  {
    key: 4,
    label: <strong>4</strong>,
    isNumber: true,
  },
  {
    key: 5,
    label: <strong>5</strong>,
    isNumber: true,
  },
  {
    key: 6,
    label: <strong>6</strong>,
    isNumber: true,
  },
  {
    key: Operator.Times,
    label: <FontAwesomeIcon size="xs" icon={faXmark} />,
  },

  // row 4
  {
    key: 1,
    label: <strong>1</strong>,
    isNumber: true,
  },
  {
    key: 2,
    label: <strong>2</strong>,
    isNumber: true,
  },
  {
    key: 3,
    label: <strong>3</strong>,
    isNumber: true,
  },
  {
    key: Operator.Minus,
    label: <FontAwesomeIcon size="xs" icon={faMinus} />,
  },

  // row 5
  {
    key: 0,
    label: <strong>0</strong>,
    isNumber: true,
  },
  {
    key: Action.Decimal,
    label: <strong>{Action.Decimal}</strong>,
  },
  {
    key: Operator.Percent,
    label: <FontAwesomeIcon size="xs" icon={faPercent} />,
  },
  {
    key: Operator.Plus,
    label: <FontAwesomeIcon size="xs" icon={faPlus} />,
  },
];

export const operatorMap: Record<string, string> = {
  "/": "\u00F7",
  "*": "\u00D7",
  "-": "\u2212",
  "+": "\u002B",
};

export const reverseOperatorMap: Record<string, string> = {
  "\u00F7": "/",
  "\u00D7": "*",
  "\u2212": "-",
  "\u002B": "+",
};
