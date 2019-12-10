import * as fs from "fs";

type Asteroid = { x: number; y: number };
const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split("\n")
  .map(val => val.split(""));

const base: Asteroid = { x: 17, y: 22 };
// const base: Asteroid = { x: 8, y: 1 }; // for in1
// const base: Asteroid = { x: 11, y: 13 }; // for in2
// const base: Asteroid = { x: 2, y: 2 }; // for in3

const xLen = input[0].length;
const yLen = input.length;
const asteroids: Array<Asteroid> = [];
for (let x = 0; x < xLen; x++) {
  for (let y = 0; y < yLen; y++) {
    if (input[y][x] === "#" && !(y === base.y && x === base.x)) {
      asteroids.push({ x, y });
    }
    if (input[y][x] === "#" && y === base.y && x === base.x) {
      console.log("Planting base.");
      console.log("Installing giant laser.");
    }
  }
}

let laserRot = -0.00001;
let remainingAst: Array<Asteroid> = [...asteroids];
let counter = 0;
for (let i = 0; i < 200; i++) {
  let result = next(base, laserRot, remainingAst);
  if (!result.ast) {
    result = next(base, 0, remainingAst);
  }
  console.log(result.ast, counter++);
  remainingAst = remainingAst.filter(val => val !== result.ast);
  laserRot = result.rot;
}

function next(
  base: Asteroid,
  lastRot: number,
  asteroids: Array<Asteroid>
): { ast: Asteroid | undefined; rot: number } {
  let currentBest = Infinity;
  let currentAst: Asteroid | undefined = undefined;
  function checkBetter(rot: number): boolean {
    return rot > lastRot && rot < currentBest;
  }
  function checkEqual(rot: number): boolean {
    return rot > lastRot && Math.abs(rot - currentBest) < 0.00001;
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
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

function rot(base: Asteroid, a: Asteroid): number {
  const x = a.x - base.x;
  const y = base.y - a.y;
  return (Math.atan2(x, y) + 2 * Math.PI) % (2 * Math.PI);
}
