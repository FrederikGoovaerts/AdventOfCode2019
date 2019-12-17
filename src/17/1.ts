import * as fs from "fs";
import assert from "assert";
import { intcode, feedbackType } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

const runner = intcode(input);
const scaffold: Set<string> = new Set();

let next = runner.next();
let x = 0;
let y = 0;
let visual = "";
while (next.value.type === "OUTPUT") {
  const char = String.fromCharCode(next.value.output);
  visual += char;
  if (char === "#") {
    scaffold.add(serPos([x, y]));
    x++;
  } else if (char === ".") {
    x++;
  } else if (char === "\n") {
    y++;
    x = 0;
  } else {
    scaffold.add(serPos([x, y]));
    x++;
  }
  next = runner.next();
}
let alignmentSum = 0;
for (const el of scaffold) {
  const point = deserPos(el);
  const containsVal = (val: string) => (scaffold.has(val) ? 1 : 0);
  if (
    containsVal(serPos([point[0] - 1, point[1]])) +
      containsVal(serPos([point[0] + 1, point[1]])) +
      containsVal(serPos([point[0], point[1] - 1])) +
      containsVal(serPos([point[0], point[1] + 1])) >
    2
  ) {
    alignmentSum += point[0] * point[1];
  }
}
console.log(visual);
console.log(alignmentSum);

// Helpers

function serPos(input: [number, number]): string {
  return `${input[0]},${input[1]}`;
}
function deserPos(input: string): [number, number] {
  const split = input.split(",");
  return [Number(split[0]), Number(split[1])];
}
