import * as fs from "fs";
import { intcode } from "../shared/intcode";

const program: number[] = fs
  .readFileSync("input", "utf8")
  .split("\n")[0]
  .split(",")
  .map((n: string) => Number(n));

for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    program[1] = i;
    program[2] = j;

    const runner = intcode(program);
    const result = runner.next();
    if (result.value.type !== "HALT") {
      throw new Error("Expected intcode to halt");
    }
    if (result.value.output[0] === 19690720) {
      console.log(i * 100 + j);
    }
  }
}
