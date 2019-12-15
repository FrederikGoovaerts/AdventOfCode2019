import * as fs from "fs";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

type Coord = { x: number; y: number };
const matches = (val: Coord) => val.x === currentX && val.y === currentY;
const doesNotMatch = (val: Coord) => !matches(val);

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];
let currentDir = 0;
let currentX: number = 0;
let currentY: number = 0;
let tainted: Coord[] = [];
let painted: Coord[] = [];

const runner = intcode(input);

let state = runner.next();
while (state.value.type !== "HALT") {
  let next = runner.next(painted.some(matches) ? 1 : 0);
  if (next.value.type !== "OUTPUT") {
    throw new Error("Expected intcode to produce output");
  }
  paint(next.value.output);

  next = runner.next();
  if (next.value.type !== "OUTPUT") {
    throw new Error("Expected intcode to produce output");
  }
  updateDirection(next.value.output);
  // Some expert debugging:
  // console.log(
  //   state.value,
  //   newColor,
  //   newDir,
  //   currentX,
  //   currentY,
  //   currentDir,
  //   painted.length,
  //   tainted.length
  // );
  state = runner.next();
}

console.log(tainted.length);

// Helpers

function updateDirection(input: number) {
  if (input === 0) {
    currentDir = (currentDir - 1 + 4) % 4;
  } else if (input === 1) {
    currentDir = (currentDir + 1) % 4;
  }
  currentX += directions[currentDir][0];
  currentY += directions[currentDir][1];
}

function paint(input: number) {
  if (input === 1) {
    if (!tainted.some(matches)) {
      tainted.push({ x: currentX, y: currentY });
    }
    if (!painted.some(matches)) {
      painted.push({ x: currentX, y: currentY });
    }
  } else if (input === 0) {
    painted = painted.filter(doesNotMatch);
  }
}
