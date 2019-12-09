import * as fs from "fs";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

const runner = intcode(input);
runner.next(2);
let result = runner.next(2);
while (!result.done) {
  console.log(result.value);
  result = runner.next(2);
}
