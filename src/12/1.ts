import * as fs from "fs";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split("\n")
  .map(val =>
    val
      .replace("<x=", "")
      .replace(" y=", "")
      .replace(" z=", "")
      .replace(">", "")
  )
  .map(val => val.split(","));

type Moon = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
};
const moons: Moon[] = [];
for (const moonInput of input) {
  moons.push({
    x: Number(moonInput[0]),
    y: Number(moonInput[1]),
    z: Number(moonInput[2]),
    vx: 0,
    vy: 0,
    vz: 0
  });
}

for (let i = 0; i < 1000; i++) {
  timeStep();
}
console.log(calcEnergy());

function timeStep() {
  updateVel();
  updatePos();
}

function updateVel() {
  for (const a of moons) {
    for (const b of moons) {
      a.vx += posCmp(a.x, b.x);
      a.vy += posCmp(a.y, b.y);
      a.vz += posCmp(a.z, b.z);
    }
  }
}

function updatePos() {
  for (const a of moons) {
    a.x += a.vx;
    a.y += a.vy;
    a.z += a.vz;
  }
}

function posCmp(a: number, b: number): 1 | 0 | -1 {
  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  }
  return 0;
}

function calcEnergy() {
  let result = 0;
  for (const moon of moons) {
    result +=
      (Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z)) *
      (Math.abs(moon.vx) + Math.abs(moon.vy) + Math.abs(moon.vz));
  }
  return result;
}
