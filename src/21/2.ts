import * as fs from "fs";
import assert from "assert";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

const asciify = (input: string) =>
  input.split("").map(val => val.charCodeAt(0));
const l1 = asciify("OR I J\n");
const l2 = asciify("OR F J\n");
const l3 = asciify("AND E J\n");
const l4 = asciify("OR H J\n");
const l5 = asciify("AND D J\n");
const l6 = asciify("OR J T\n");
const l7 = asciify("AND A T\n");
const l8 = asciify("AND B T\n");
const l9 = asciify("AND C T\n");
const l10 = asciify("NOT T T\n");
const l11 = asciify("AND T J\n");
const l12 = asciify("RUN\n");

const runner = intcode(input);
let next = runner.next();
while (next.value.type === "OUTPUT") {
  next = runner.next();
}
provide(l1);
provide(l2);
provide(l3);
provide(l4);
provide(l5);
provide(l6);
provide(l7);
provide(l8);
provide(l9);
provide(l10);
provide(l11);
provide(l12);
next = runner.next();
while (next.value.type === "OUTPUT") {
  if (next.value.output > 255) {
    console.log(next.value.output);
    break;
  }
  next = runner.next();
}

function provide(input: number[]): number {
  let next = undefined;
  for (const el of input) {
    next = runner.next(el);
  }
  if (next?.value.type === "OUTPUT") {
    return next.value.output;
  }
  return 0;
}
