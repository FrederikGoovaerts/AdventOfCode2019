import * as fs from "fs";

const lower = 136760;
const upper = 595730;

let counter = 0;
for (let i = lower; i <= upper; i++) {
  const stringified: string[] = String(i).split("");
  if (hasDoubles(stringified) && isRising(stringified)) {
    counter++;
  }
}

console.log(counter);

function hasDoubles(input: string[]): boolean {
  for (let i = 0; i < input.length - 1; i++) {
    if (input[i] === input[i + 1]) {
      return true;
    }
  }
  return false;
}

function isRising(input: string[]): boolean {
  for (let i = 0; i < input.length - 1; i++) {
    if (Number(input[i]) > Number(input[i + 1])) {
      return false;
    }
  }
  return true;
}
