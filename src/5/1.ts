import * as fs from "fs";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .split("\n")[0]
  .split(",")
  .map(Number);

const runner = intcode(input);
runner.next(1);
let result = runner.next(1).value;
while (result === 0) {
  result = runner.next(1).value;
}
console.log(result);
