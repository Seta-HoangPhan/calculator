import { operatorMap, reverseOperatorMap } from "../constants";

export const convertOperator = (val: string) => {
  const operatorRegex = new RegExp(
    `[${Object.keys(operatorMap).join("")}]`,
    "g"
  );
  return val.replace(operatorRegex, (match) => operatorMap[match]);
};

export const reverseOperator = (val: string) => {
  const operatorRegex = new RegExp(
    `[${Object.keys(reverseOperatorMap).join("")}]`,
    "g"
  );
  return val.replace(operatorRegex, (match) => reverseOperatorMap[match]);
};
