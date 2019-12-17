import * as fs from "fs";
import assert from "assert";
import { intcode, feedbackType } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

// Path to take:
// L,6,R,8,L,4,R,8,L,12,
// L,12,R,10,L,4,L,12,R,10,L,4,
// L,12,L,6,
// L,4,L,4,
// L,12,R,10,L,4,L,12,
// L,6,L,4,
// L,4,L,12,R,10,L,4,
// L,12,L,6,
// L,4,L,4,
// L,6,R8,L,4,R,8,L,12,L,6,R,8,L,4,R,8,L,12

const runner = intcode(input);
