import * as fs from "fs";
import { intcode, feedbackType } from "../shared/intcode";

const program: number[] = fs
  .readFileSync("input", "utf8")
  .split("\n")[0]
  .split(",")
  .map((n: string) => Number(n));

program[1] = 12;
program[2] = 2;

const runner = intcode(program);
const next = runner.next();
if (next.value.type !== feedbackType.HALT) {
  throw new Error("Expected intcode to halt");
}
console.log(next.value.output[0]);
