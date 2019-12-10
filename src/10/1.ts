import * as fs from "fs";

type Asteroid = { x: number; y: number };
const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split("\n")
  .map(val => val.split(""));

const xLen = input[0].length;
const yLen = input.length;
const asteroids: Array<Asteroid> = [];
for (let x = 0; x < xLen; x++) {
  for (let y = 0; y < yLen; y++) {
    if (input[y][x] === "#") {
      asteroids.push({ x, y });
    }
  }
}

let currentBest = 0;
let currentAst: Asteroid | undefined = undefined;
for (const a of asteroids) {
  const vis = amountVisible(a, asteroids);
  if (vis > currentBest) {
    currentBest = vis;
    currentAst = a;
  }
}
console.log(currentBest, currentAst);

function amountVisible(a: Asteroid, asteroids: Array<Asteroid>): number {
  const others = asteroids.filter(val => val !== a);
  let counter = 0;
  let b = others.pop();
  while (!!b) {
    const slope = (a.y + 1 - (b.y + 1)) / (a.x + 1 - (b.x + 1));
    for (let i = 0; i < others.length; i++) {
      const c = others[i];
      let eq: number = NaN;
      if (Math.abs(slope) === Infinity) {
        eq = c.x - a.x;
      } else {
        eq = a.y - c.y + slope * (c.x - a.x);
      }
      if (eq === 0 && checkDir(a, b, c)) {
        others.splice(i, 1);
        i--;
      }
    }
    counter++;
    b = others.pop();
  }
  return counter;
}

function checkDir(a: Asteroid, b: Asteroid, c: Asteroid): boolean {
  const xCheck = (a.x >= b.x && a.x >= c.x) || (a.x <= b.x && a.x <= c.x);
  const yCheck = (a.y >= b.y && a.y >= c.y) || (a.y <= b.y && a.y <= c.y);
  return yCheck && xCheck;
}
