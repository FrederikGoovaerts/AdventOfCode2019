import * as fs from "fs";
import assert from "assert";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

let counter = 0;
for (let x = 0; x < 50; x++) {
  for (let y = 0; y < 50; y++) {
    const runner = intcode(input);
    let next = runner.next();
    next = runner.next(x);
    next = runner.next(y);
    if (next.value.type === "OUTPUT") {
      counter += next.value.output;
    }
  }
}
console.log(counter);
