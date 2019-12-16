import * as fs from "fs";

const input: number[] = fs
  .readFileSync("input", "utf8")
  .trim()
  .split("")
  .map((n: string) => Number(n));

const pattern = [0, 1, 0, -1];

console.log(
  getPhase(100, "80871224585914546619083218645595".split("").map(Number))
    .splice(0, 8)
    .join("")
);
console.log(
  getPhase(100, "19617804207202209144916044189917".split("").map(Number))
    .splice(0, 8)
    .join("")
);
console.log(
  getPhase(100, "69317163492948606335995924319873".split("").map(Number))
    .splice(0, 8)
    .join("")
);
console.log(
  getPhase(100, input)
    .splice(0, 8)
    .join("")
);

// Helpers

function getPhase(nb: number, start: number[]): number[] {
  const length = start.length;
  let currentPhase = [...start];
  for (let phaseCount = 0; phaseCount < nb; phaseCount++) {
    const nextPhase = new Array(length);
    nextPhase.fill(0);
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        const ind = (Math.floor((j + 1) / (i + 1)) + 4) % 4;
        nextPhase[i] += currentPhase[j] * pattern[ind];
      }
    }
    currentPhase = nextPhase.map(val => Math.abs(val) % 10);
  }
  return currentPhase;
}
