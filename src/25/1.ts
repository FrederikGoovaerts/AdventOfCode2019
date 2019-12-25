import * as fs from "fs";
import * as readline from "readline";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "COMMAND> "
});

const runner = intcode(input);
let next = runner.next();
const out = [];
while (next.value.type === "OUTPUT") {
  out.push(next.value.output);
  next = runner.next();
}
console.log(String.fromCharCode(...out));

rl.on("line", lineRaw => {
  const line = lineRaw.trim();
  const out = [];
  let next = provide(line + "\n")!;
  while (next.value.type === "OUTPUT") {
    out.push(next.value.output);
    next = runner.next();
  }
  console.log(String.fromCharCode(...out));
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});

rl.prompt();

function provide(input: string) {
  const charCodes = input.split("").map(val => val.charCodeAt(0));
  let next = undefined;
  for (const el of charCodes) {
    next = runner.next(el);
  }
  return next;
}
