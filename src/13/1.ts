import * as fs from "fs";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

const runner = intcode(input);
let counter = 0;
let done = false;
while (!done) {
  let state = runner.next();
  state = runner.next();
  state = runner.next();
  counter += state.value === 2 ? 1 : 0;
  done = Boolean(state.done);
}
console.log(counter);
