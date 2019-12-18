import * as fs from "fs";
import assert from "assert";

const input: string[][] = fs
  .readFileSync("in3", "utf8")
  .trim()
  .split("\n")
  .map(val => val.split(""));

const neighbors: Map<string, string[]> = new Map();
// Map from position to door name
const doorLoc: Map<string, string> = new Map();
// Map from key name to position
const keyLocations: Map<string, string> = new Map();
const allKeys: Set<string> = new Set();
let originPos: [number, number] = [-1, -1];

const lookup: Map<string, { keys: Set<string>; length: number }> = new Map();
const lookup2: Map<string, number> = new Map();

for (let row = 1; row < input.length - 1; row++) {
  for (let column = 1; column < input[0].length - 1; column++) {
    const symbol = input[row][column];
    if (symbol === "#") {
      continue;
    } else {
      const possibleNeighbors: [number, number][] = [
        [row + 1, column],
        [row - 1, column],
        [row, column + 1],
        [row, column - 1]
      ];
      const locNeighbors = [];
      for (const n of possibleNeighbors) {
        if (input[n[0]][n[1]] !== "#") {
          locNeighbors.push(serPos(n));
        }
      }
      neighbors.set(serPos([row, column]), locNeighbors);
    }
    if (symbol.match(/[a-z]/)) {
      keyLocations.set(symbol, serPos([row, column]));
      allKeys.add(symbol);
    } else if (symbol.match(/[A-Z]/)) {
      doorLoc.set(serPos([row, column]), symbol);
    } else if (symbol === "@") {
      originPos = [row, column];
    }
  }
}
console.log(bestPath(serPos(originPos), new Set(), allKeys, 0, Infinity, "@"));

// Helpers

function bestPath(
  currentPosition: string,
  currentKeys: Set<string>,
  keysLeft: Set<string>,
  currentLength: number,
  bestKnown: number,
  origin: string
): number {
  if (keysLeft.size === 0) {
    return 0;
  }
  let currentBest = Infinity;
  for (const target of keysLeft) {
    const distToTarget = lookupDistance(
      currentPosition,
      keyLocations.get(target)!,
      currentKeys,
      origin,
      target
    );
    if (distToTarget !== Infinity && currentLength + distToTarget < bestKnown) {
      const newCurrKeys = new Set(currentKeys);
      newCurrKeys.add(target);
      const newKeysLeft = new Set(keysLeft);
      newKeysLeft.delete(target);
      const remainingPath = bestPath(
        keyLocations.get(target)!,
        newCurrKeys,
        newKeysLeft,
        currentLength + distToTarget,
        bestKnown,
        target
      );
      if (distToTarget + remainingPath < currentBest) {
        currentBest = distToTarget + remainingPath;
      }
    }
  }
  return currentBest;
}

function lookupDistance(
  start: string,
  end: string,
  keys: Set<string>,
  origin: string,
  target: string
): number {
  const ser = `${origin},${target}`;
  if (!lookup.has(ser)) {
    const dist = getDistance(start, end, allKeys);
    lookup.set(ser, {
      length: dist.length,
      keys: new Set(dist.doorsPassed.map(val => val.toLowerCase()))
    });
  }
  const looked = lookup.get(ser)!;
  let optimal: boolean = true;
  for (const key of looked.keys) {
    if (!keys.has(key)) {
      optimal = false;
    }
  }
  if (optimal) {
    return looked.length;
  }
  return Infinity;

  // The code below seems unnecessary
  const ser2 = `${origin},${[...keys].sort().join()},${target}`;
  if (lookup2.has(ser2)) {
    return lookup2.get(ser2)!;
  }
  const a = getDistance(start, end, keys).length;
  lookup2.set(ser2, a);
  console.log(lookup2);
  return a;
}

function getDistance(
  start: string,
  end: string,
  keys: Set<string>
): { length: number; doorsPassed: string[] } {
  const startPos = deserPos(start);
  const h = (a: [number, number]) =>
    Math.abs(a[0] - startPos[0]) + Math.abs(a[1] - startPos[1]);

  const openSet = new Set<string>();
  openSet.add(start);

  const cameFrom: Map<string, string> = new Map();

  const gScore: Map<string, number> = new Map();
  gScore.set(start, 0);

  const fScore: Map<string, number> = new Map();
  fScore.set(start, h(startPos));

  while (openSet.size > 0) {
    let current = "";
    let currentF = Infinity;
    for (const open of openSet) {
      const openF = fScore.get(open) ?? Infinity;
      if (openF < currentF) {
        current = open;
        currentF = openF;
      }
    }

    if (current === end) {
      const path = [];
      let pathCurrent = end;
      while (pathCurrent !== start) {
        path.push(pathCurrent);
        pathCurrent = cameFrom.get(pathCurrent)!;
      }
      return {
        length: path.length,
        doorsPassed: path
          .map(val => doorLoc.get(val) || "undefined")
          .filter(val => val !== "undefined") // Tee-hee!
      };
    }

    openSet.delete(current);
    for (const n of neighbors.get(current)!) {
      if (doorLoc.has(n) && !keys.has(doorLoc.get(n)!.toLowerCase())) {
        continue;
      }
      const tentG = gScore.get(current)! + 1;
      if (!gScore.has(n) || gScore.get(n)! > tentG) {
        cameFrom.set(n, current);
        gScore.set(n, tentG);
        fScore.set(n, tentG + h(deserPos(n)));
        if (!openSet.has(n)) {
          openSet.add(n);
        }
      }
    }
  }
  return { length: Infinity, doorsPassed: [] };
}

function serPos(input: [number, number]): string {
  return `${input[0]},${input[1]}`;
}
function deserPos(input: string): [number, number] {
  const split = input.split(",");
  return [Number(split[0]), Number(split[1])];
}
