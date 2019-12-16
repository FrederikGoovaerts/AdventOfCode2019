import * as fs from "fs";
const input: number[] = fs
  .readFileSync("input", "utf8")
  .trim()
  .repeat(10000)
  .split("")
  .map((n: string) => Number(n));

// This solution assumes (from both the examples and input) that the part
// to calculate is in the latter half of the repeated input

const offset = Number(input.slice(0, 7).join(""));
let state = input.slice(offset);
for (let i = 0; i < 100; i++) {
  state = nextPhase(state);
}
console.log(state.slice(0, 8).join(""));

// Helpers

function nextPhase(input: number[]): number[] {
  const length = input.length;
  const phase = [...input];
  for (let shift = length - 2; shift >= 0; shift--) {
    phase[shift] = (phase[shift] + phase[shift + 1]) % 10;
  }
  return phase;
}
