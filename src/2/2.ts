import * as fs from "fs";

// Read input
const programBase: number[] = fs
  .readFileSync("input", "utf8")
  .split("\n")[0]
  .split(",")
  .map((n: string) => Number(n));

for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    const program = [...programBase];

    let position = 0;
    let instruction = program[position];

    program[1] = i;
    program[2] = j;

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

    if (program[0] === 19690720) {
      console.log(i * 100 + j);
    }
  }
}
