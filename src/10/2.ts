import * as fs from "fs";

type Asteroid = { x: number; y: number };
const input = fs
  .readFileSync("in1", "utf8")
  .trim()
  .split("\n")
  .map(val => val.split(""));

// const base: Asteroid = { x: 17, y: 7 };
const base: Asteroid = { x: 8, y: 1 }; // for in1

const xLen = input[0].length;
const yLen = input.length;
const asteroids: Array<Asteroid> = [];
for (let x = 0; x < xLen; x++) {
  for (let y = 0; y < yLen; y++) {
    const swappedY = yLen - 1 - y;
    if (input[y][x] === "#" && !(swappedY === base.y && x === base.x)) {
      asteroids.push({ x, y: swappedY });
    }
    if (input[y][x] === "#" && swappedY === base.y && x === base.x) {
      console.log("Planting base.");
      console.log("Installing giant laser.");
    }
  }
}

let laserRot = Math.PI / 2 + 0.00001;
let remainingAst: Array<Asteroid> = [...asteroids];
for (let i = 0; i < 5; i++) {
  let result = next(base, laserRot, remainingAst);
  if (!result.ast) {
    result = next(base, 2 * Math.PI, remainingAst);
  }
  console.log(result.ast);
  remainingAst = remainingAst.filter(val => val !== result.ast);
  laserRot = result.rot;
}

function next(
  base: Asteroid,
  lastRot: number,
  asteroids: Array<Asteroid>
): { ast: Asteroid | undefined; rot: number } {
  let currentBest = Infinity;
  let currentAst = undefined;
  function checkBetter(rot: number): boolean {
    return rot < lastRot && lastRot - rot < currentBest;
  }
  function checkEqual(rot: number): boolean {
    return rot < lastRot && lastRot - rot === currentBest;
  }
  for (const a of asteroids) {
    const rotFromBase = rot(base, a);
    if (
      checkBetter(rotFromBase) ||
      (checkEqual(rotFromBase) && dist(base, a) < dist(base, currentAst))
    ) {
      currentBest = rotFromBase;
      currentAst = a;
    }
  }
  return { ast: currentAst, rot: currentBest };
}

function dist(a: Asteroid, b: Asteroid | undefined) {
  if (!b) {
    return Infinity;
  }
  return Math.sqrt((b.x - a.x) ** 2 + (b.x - a.y) ** 2);
}

function rot(base: Asteroid, a: Asteroid): number {
  const x = a.x - base.x;
  const y = a.y - base.y;
  return (Math.atan2(y, x) + 2 * Math.PI) % (2 * Math.PI);
}
