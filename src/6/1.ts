import * as fs from "fs";

const input = fs.readFileSync("input", "utf8").split("\n");

let orbs: { [key: string]: string } = {};
for (const orb of input) {
  if (orb.includes(")")) {
    const split = orb.split(")");
    orbs[split[1]] = split[0];
  }
}

let counter = 0;
for (const orb of Object.keys(orbs)) {
  let current = orb;
  while (current !== "COM") {
    current = orbs[current];
    counter++;
  }
}

console.log(counter);
