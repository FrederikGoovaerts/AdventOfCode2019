import * as fs from "fs";
import assert from "assert";
import { intcode, feedbackType } from "../shared/intcode";
import { goalPath } from "./shared";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

// Semantically: N S W E
const directions: [1, 2, 3, 4] = [1, 2, 3, 4];
// Provides the semantic mapping
const dirOff = (dir: 1 | 2 | 3 | 4) =>
  [
    [0, 1],
    [0, -1],
    [-1, 0],
    [1, 0]
  ][dir - 1];

const enum Result {
  Wall = 0,
  Step,
  Goal
}

const distances: Map<string, number> = new Map();
const pathTo: Map<string, number[]> = new Map();
const toVisit: Set<string> = new Set();
const visited: Set<string> = new Set();

let curr: [number, number] = [0, 0];
distances.set(serPos(curr), 0);
pathTo.set(serPos(curr), goalPath);
toVisit.add(serPos(curr));

while (toVisit.size > 0) {
  // select next current
  let dist = Infinity;
  for (const candidate of toVisit) {
    const candDist = distances.get(candidate)!;
    if (candDist < dist) {
      curr = deserPos(candidate);
      dist = candDist;
    }
  }
  const currSer = serPos(curr);
  toVisit.delete(currSer);
  visited.add(currSer);

  const currDist = distances.get(currSer)!;
  const currPath = pathTo.get(currSer)!;
  for (const dir of directions) {
    const target = serPos([curr[0] + dirOff(dir)[0], curr[1] + dirOff(dir)[1]]);
    if (!visited.has(target)) {
      const res = runPath(currPath, dir);
      if (res === Result.Step) {
        const targetDist = distances.get(target);
        if (targetDist === undefined || targetDist > currDist + 1) {
          distances.set(target, currDist + 1);
          pathTo.set(target, [...currPath, dir]);
        }
        if (!toVisit.has(target)) {
          toVisit.add(target);
        }
      }
    }
  }
}
let largest = 0;
for (const dist of distances) {
  largest = Math.max(largest, dist[1]);
}
console.log(largest);

// Helpers

function serPos(input: [number, number]): string {
  return `${input[0]},${input[1]}`;
}
function deserPos(input: string): [number, number] {
  const split = input.split(",");
  return [Number(split[0]), Number(split[1])];
}

function runPath(initialPath: number[], lastStep: number) {
  const runner = intcode(input);
  let next = runner.next();
  assert(next.value.type === feedbackType.INPUT);
  for (let dir of initialPath) {
    next = runner.next(dir);
    assert(next.value.type === feedbackType.OUTPUT);
    next = runner.next();
    assert(next.value.type === feedbackType.INPUT);
  }
  next = runner.next(lastStep);
  if (next.value.type === feedbackType.OUTPUT) {
    return next.value.output;
  }
  throw new Error("Unexpected state");
}
