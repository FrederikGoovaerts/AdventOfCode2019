import * as fs from "fs";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .split(",")
  .map(Number);

function generateSettings(length: number): number[][] {
  return generateSettingsRec(
    new Array(length).fill(-1),
    0,
    new Array(length).fill(0).map((val, index) => index)
  );
}

function generateSettingsRec(
  acc: number[],
  curr: number,
  openLocs: number[]
): number[][] {
  if (openLocs.length === 0) {
    return [acc];
  }
  let result: number[][] = [];
  for (const loc of openLocs) {
    const res = [...acc];
    res[loc] = curr;
    result = result.concat(
      generateSettingsRec(
        res,
        curr + 1,
        openLocs.filter(val => val !== loc)
      )
    );
  }
  return result;
}

const combinations = generateSettings(5);
let currentBest = 0;
for (const combination of combinations) {
  let nextInput: number = 0;
  for (let i = 0; i < combination.length; i++) {
    const runner = intcode(input);
    runner.next();
    runner.next(combination[i]);
    const result = runner.next(nextInput);
    if (result.value.type !== "OUTPUT") {
      throw new Error("Expected intcode to produce output");
    }
    nextInput = result.value.output;
  }
  if (nextInput > currentBest) {
    currentBest = nextInput;
  }
}
console.log(currentBest);
