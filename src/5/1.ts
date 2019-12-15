import * as fs from "fs";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .split("\n")[0]
  .split(",")
  .map(Number);

const runner = intcode(input);
runner.next();
runner.next(1);
let result = runner.next();
while (result.value.type === "OUTPUT" && result.value.output === 0) {
  result = runner.next();
}
if (result.value.type !== "OUTPUT") {
  throw new Error("Expected intcode to provide output");
}
console.log(result.value.output);
