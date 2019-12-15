import * as fs from "fs";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

const runner = intcode(input);
let counter = 0;
while (true) {
  let state = runner.next();
  if (state.value.type === "HALT") {
    break;
  }
  state = runner.next();
  state = runner.next();
  if (state.value.type !== "OUTPUT") {
    throw new Error("Expected output");
  }
  counter += state.value.output === 2 ? 1 : 0;
}
console.log(counter);
