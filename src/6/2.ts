import * as fs from "fs";

const input = fs.readFileSync("input", "utf8").split("\n");

let orbs: { [key: string]: string } = {};
for (const orb of input) {
  if (orb.includes(")")) {
    const split = orb.split(")");
    orbs[split[1]] = split[0];
  }
}

const youPath = path("YOU");
const sanPath = path("SAN");
let same: string = "";
for (const el of youPath) {
  if (sanPath.includes(el)) {
    same = el;
    break;
  }
}
console.log(distTo(same, youPath) + distTo(same, sanPath) - 2);

// helper

function path(from: string): string[] {
  const result: string[] = [];
  let current = from;
  while (current !== "COM") {
    result.push(current);
    current = orbs[current];
  }
  return result;
}

function distTo(to: string, path: string[]): number {
  for (let i = 0; i < path.length; i++) {
    if (path[i] === to) {
      return i;
    }
  }
  return NaN;
}
