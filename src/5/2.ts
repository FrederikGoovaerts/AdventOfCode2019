import * as fs from "fs";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .split(",")
  .map(Number);

const runner = intcode(input);
runner.next(5);
let result = runner.next(5).value;
console.log(result);
