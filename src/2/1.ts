import * as fs from "fs";
import { intcode } from "../shared/intcode";

const program: number[] = fs
  .readFileSync("input", "utf8")
  .split("\n")[0]
  .split(",")
  .map((n: string) => Number(n));

program[1] = 12;
program[2] = 2

const runner = intcode(program);
const result = runner.next();
if (result.done) {
  console.log(result.value[0]);
}

