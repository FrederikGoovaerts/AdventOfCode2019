import * as fs from "fs";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split("\n")
  .map(val => val.split(""));

let state = new Set<string>();
for (let row = 0; row < 5; row++) {
  for (let column = 0; column < 5; column++) {
    const pos = serPos(row, column, 0);
    if (input[row][column] === "#") {
      state.add(pos);
    }
  }
}

let minNextLevel = -1;
let maxNextLevel = 1;
for (let minute = 0; minute < 200; minute++) {
  const newState = new Set<string>();
  for (let level = minNextLevel; level <= maxNextLevel; level++) {
    for (let row = 0; row < 5; row++) {
      for (let column = 0; column < 5; column++) {
        if (row === 2 && column === 2) {
          continue;
        }
        const pos = serPos(row, column, level);
        const neighbors = getNeighbors(row, column, level);
        if (state.has(pos) && liveNeighbors(neighbors, state) === 1) {
          newState.add(pos);
        } else if (
          !state.has(pos) &&
          [1, 2].includes(liveNeighbors(neighbors, state))
        ) {
          newState.add(pos);
          minNextLevel = Math.min(minNextLevel, level - 1);
          maxNextLevel = Math.max(maxNextLevel, level + 1);
        }
      }
    }
  }
  state = newState;
}

console.log(state.size);

function liveNeighbors(neighbors: string[], state: Set<string>): number {
  return neighbors
    .map(val => (state.has(val) ? 1 : 0) as number)
    .reduce((a: number, b: number) => a + b);
}

function serPos(row: number, column: number, level: number): string {
  return `${row},${column},${level}`;
}

function getNeighbors(row: number, column: number, level: number): string[] {
  // Corners of a level
  if (row === 0 && column === 0) {
    return [
      serPos(1, 2, level - 1),
      serPos(0, 1, level),
      serPos(1, 0, level),
      serPos(2, 1, level - 1)
    ];
  }
  if (row === 0 && column === 4) {
    return [
      serPos(1, 2, level - 1),
      serPos(2, 3, level - 1),
      serPos(1, 4, level),
      serPos(0, 3, level)
    ];
  }
  if (row === 4 && column === 0) {
    return [
      serPos(3, 0, level),
      serPos(4, 1, level),
      serPos(3, 2, level - 1),
      serPos(2, 1, level - 1)
    ];
  }
  if (row === 4 && column === 4) {
    return [
      serPos(3, 4, level),
      serPos(2, 3, level - 1),
      serPos(3, 2, level - 1),
      serPos(4, 3, level)
    ];
  }

  // Remaining outer edges of a level
  if (row === 0) {
    return [
      serPos(1, 2, level - 1),
      serPos(row, column + 1, level),
      serPos(row + 1, column, level),
      serPos(row, column - 1, level)
    ];
  }
  if (row === 4) {
    return [
      serPos(row - 1, column, level),
      serPos(row, column + 1, level),
      serPos(3, 2, level - 1),
      serPos(row, column - 1, level)
    ];
  }
  if (column === 0) {
    return [
      serPos(row - 1, column, level),
      serPos(row, column + 1, level),
      serPos(row + 1, column, level),
      serPos(2, 1, level - 1)
    ];
  }
  if (column === 4) {
    return [
      serPos(row - 1, column, level),
      serPos(2, 3, level - 1),
      serPos(row + 1, column, level),
      serPos(row, column - 1, level)
    ];
  }

  // Inner edges of a level
  if (row === 1 && column === 2) {
    return [
      serPos(row - 1, column, level),
      serPos(row, column + 1, level),
      serPos(0, 0, level + 1),
      serPos(0, 1, level + 1),
      serPos(0, 2, level + 1),
      serPos(0, 3, level + 1),
      serPos(0, 4, level + 1),
      serPos(0, 5, level + 1),
      serPos(row, column - 1, level)
    ];
  }
  if (row === 2 && column === 3) {
    return [
      serPos(row - 1, column, level),
      serPos(row, column + 1, level),
      serPos(row + 1, column, level),
      serPos(0, 4, level + 1),
      serPos(1, 4, level + 1),
      serPos(2, 4, level + 1),
      serPos(3, 4, level + 1),
      serPos(4, 4, level + 1)
    ];
  }
  if (row === 3 && column === 2) {
    return [
      serPos(4, 0, level + 1),
      serPos(4, 1, level + 1),
      serPos(4, 2, level + 1),
      serPos(4, 3, level + 1),
      serPos(4, 4, level + 1),
      serPos(row, column + 1, level),
      serPos(row + 1, column, level),
      serPos(row, column - 1, level)
    ];
  }
  if (row === 2 && column === 1) {
    return [
      serPos(row - 1, column, level),
      serPos(0, 0, level + 1),
      serPos(1, 0, level + 1),
      serPos(2, 0, level + 1),
      serPos(3, 0, level + 1),
      serPos(4, 0, level + 1),
      serPos(row + 1, column, level),
      serPos(row, column - 1, level)
    ];
  }

  return [
    serPos(row - 1, column, level),
    serPos(row, column + 1, level),
    serPos(row + 1, column, level),
    serPos(row, column - 1, level)
  ];
}
