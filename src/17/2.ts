import * as fs from "fs";
import assert from "assert";
import { intcode, feedbackType } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

// Path to take:
// A: L,6,R,8,L,4,R,8,L,12,
// B: L,12,R,10,L,4,
// B: L,12,R,10,L,4,
// C: L,12,L,6,L,4,L,4,
// B: L,12,R,10,L,4,
// C: L,12,L,6,L,4,L,4,
// B: L,12,R,10,L,4,
// C: L,12,L,6,L,4,L,4,
// A: L,6,R,8,L,4,R,8,L,12,
// A: L,6,R,8,L,4,R,8,L,12,

input[0] = 2;
const main = "A,B,B,C,B,C,B,C,A,A\n".split("").map(val => val.charCodeAt(0));
const a = "L,6,R,8,L,4,R,8,L,12\n".split("").map(val => val.charCodeAt(0));
const b = "L,12,R,10,L,4\n".split("").map(val => val.charCodeAt(0));
const c = "L,12,L,6,L,4,L,4\n".split("").map(val => val.charCodeAt(0));
const video = "n\n".split("").map(val => val.charCodeAt(0));

const runner = intcode(input);
let next = runner.next();
while (next.value.type === "OUTPUT") {
  next = runner.next();
}
provide(main);
provide(a);
provide(b);
provide(c);
provide(video);

function provide(input: number[]) {
  let next = undefined;
  for (const el of input) {
    next = runner.next(el);
    while (next.value.type === "OUTPUT") {
      if (next.value.output > 255) {
        console.log(next.value.output);
      }
      next = runner.next();
    }
  }
}
