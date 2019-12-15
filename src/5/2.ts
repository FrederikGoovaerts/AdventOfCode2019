import * as fs from "fs";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .split(",")
  .map(Number);

const runner = intcode(input);
runner.next();
let result = runner.next(5);
if (result.value.type !== "OUTPUT") {
  throw new Error("Expected intcode to produce output");
}
console.log(result.value.output);
