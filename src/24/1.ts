import * as fs from "fs";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split("\n")
  .map(val => val.split(""));

const neighbors = new Map<string, string[]>();
const states = new Set<string>();
let state = new Set<string>();

for (let row = 0; row < 5; row++) {
  for (let column = 0; column < 5; column++) {
    const pos = serPos([row, column]);
    if (input[row][column] === "#") {
      state.add(pos);
    }
    const neighborList = [];
    neighborList.push(serPos([row - 1, column]));
    neighborList.push(serPos([row + 1, column]));
    neighborList.push(serPos([row, column - 1]));
    neighborList.push(serPos([row, column + 1]));
    neighbors.set(pos, neighborList);
  }
}

states.add(serState(state));

let looped = false;
while (!looped) {
  const newState = new Set<string>();
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      const pos = serPos([row, column]);
      if (
        state.has(pos) &&
        liveNeighbors(neighbors.get(serPos([row, column]))!, state) === 1
      ) {
        newState.add(pos);
      } else if (
        !state.has(pos) &&
        [1, 2].includes(
          liveNeighbors(neighbors.get(serPos([row, column]))!, state)
        )
      ) {
        newState.add(pos);
      }
    }
  }
  const newStateSer = serState(newState);
  if (states.has(newStateSer)) {
    looped = true;
  }
  states.add(newStateSer);
  state = newState;
}

let bioCount = 0;
for (const el of state) {
  const [row, col] = deserPos(el);
  const bio = 2 ** (row * 5 + col);
  bioCount += bio;
}

console.log(bioCount);

function liveNeighbors(neighbors: string[], state: Set<string>): number {
  return neighbors
    .map(val => (state.has(val) ? 1 : 0) as number)
    .reduce((a: number, b: number) => a + b);
}

function serPos(input: [number, number]): string {
  return `${input[0]},${input[1]}`;
}
function deserPos(input: string): [number, number] {
  const split = input.split(",");
  return [Number(split[0]), Number(split[1])];
}

function serState(input: Set<string>): string {
  return [...input].sort().join("|");
}
