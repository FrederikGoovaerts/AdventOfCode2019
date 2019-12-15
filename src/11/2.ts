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
let painted: Coord[] = [{ x: 0, y: 0 }];

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
  state = runner.next();
}
const smollest = (prev: number, curr: number) => (curr < prev ? curr : prev);
const largest = (prev: number, curr: number) => (curr > prev ? curr : prev);
const minX = painted.map(coord => coord.x).reduce(smollest);
const maxX = painted.map(coord => coord.x).reduce(largest);
const minY = painted.map(coord => coord.y).reduce(smollest);
const maxY = painted.map(coord => coord.y).reduce(largest);
let output = "";
for (let y = maxY; y >= minY; y--) {
  for (let x = minX; x <= maxX; x++) {
    if (painted.some((val: Coord) => val.x === x && val.y === y)) {
      output += "##";
    } else {
      output += "  ";
    }
  }
  output += "\n";
}
console.log(output);

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
    if (!painted.some(matches)) {
      painted.push({ x: currentX, y: currentY });
    }
  } else if (input === 0) {
    painted = painted.filter(doesNotMatch);
  }
}
