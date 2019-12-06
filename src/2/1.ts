import * as fs from "fs";

// Read input
const program: number[] = fs
  .readFileSync("input", "utf8")
  .split("\n")[0]
  .split(",")
  .map((n: string) => Number(n));

let position = 0;
let instruction = program[position];

program[1] = 12;
program[2] = 2;

const getValueIndirect = (num: number) => program[program[num]];

while (instruction !== 99) {
  if (instruction === 1) {
    const location = program[position + 3];
    const value =
      getValueIndirect(position + 1) + getValueIndirect(position + 2);
    program[location] = value;
  } else if (instruction === 2) {
    const location = program[position + 3];
    const value =
      getValueIndirect(position + 1) * getValueIndirect(position + 2);
    program[location] = value;
  }

  position += 4;
  instruction = program[position];
}

console.log(program[0]);
