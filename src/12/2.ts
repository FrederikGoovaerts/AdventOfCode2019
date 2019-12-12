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
      .split(",")
      .map(Number)
  );

const x: number[] = [input[0][0], input[1][0], input[2][0], input[3][0]];
const y: number[] = [input[0][1], input[1][1], input[2][1], input[3][1]];
const z: number[] = [input[0][2], input[1][2], input[2][2], input[3][2]];
const vx: number[] = [0, 0, 0, 0];
const vy: number[] = [0, 0, 0, 0];
const vz: number[] = [0, 0, 0, 0];

let xRep = 0;
let yRep = 0;
let zRep = 0;

let count = 0;
let states: Set<string> = new Set();
states.add(serialize(x, vx));
while (true) {
  timeStepX();
  count++;
  const state = serialize(x, vx);
  if (states.has(state)) {
    xRep = count;
    break;
  }
  states.add(state);
}

count = 0;
states = new Set();
states.add(serialize(y, vy));
while (true) {
  timeStepY();
  count++;
  const state = serialize(y, vy);
  if (states.has(state)) {
    yRep = count;
    break;
  }
  states.add(state);
}

count = 0;
states = new Set();
states.add(serialize(z, vz));
while (true) {
  timeStepZ();
  count++;
  const state = serialize(z, vz);
  if (states.has(state)) {
    zRep = count;
    break;
  }
  states.add(state);
}

console.log(lcmVanDarragh([xRep, yRep, zRep]));

function timeStepX() {
  updateVelX();
  updatePosX();
}

function timeStepY() {
  updateVelY();
  updatePosY();
}

function timeStepZ() {
  updateVelZ();
  updatePosZ();
}

function updateVelX() {
  const getUpdate = (a: 0 | 1 | 2 | 3, b: 0 | 1 | 2 | 3) =>
    x[a] === x[b] ? 0 : (x[a] - x[b]) / Math.abs(x[a] - x[b]);
  vx[0] -= getUpdate(0, 1) + getUpdate(0, 2) + getUpdate(0, 3);
  vx[1] -= getUpdate(1, 0) + getUpdate(1, 2) + getUpdate(1, 3);
  vx[2] -= getUpdate(2, 0) + getUpdate(2, 1) + getUpdate(2, 3);
  vx[3] -= getUpdate(3, 0) + getUpdate(3, 1) + getUpdate(3, 2);
}

function updateVelY() {
  const getYUpdate = (a: 0 | 1 | 2 | 3, b: 0 | 1 | 2 | 3) =>
    y[a] === y[b] ? 0 : (y[a] - y[b]) / Math.abs(y[a] - y[b]);
  vy[0] -= getYUpdate(0, 1) + getYUpdate(0, 2) + getYUpdate(0, 3);
  vy[1] -= getYUpdate(1, 0) + getYUpdate(1, 2) + getYUpdate(1, 3);
  vy[2] -= getYUpdate(2, 0) + getYUpdate(2, 1) + getYUpdate(2, 3);
  vy[3] -= getYUpdate(3, 0) + getYUpdate(3, 1) + getYUpdate(3, 2);
}

function updateVelZ() {
  const getZUpdate = (a: 0 | 1 | 2 | 3, b: 0 | 1 | 2 | 3) =>
    z[a] === z[b] ? 0 : (z[a] - z[b]) / Math.abs(z[a] - z[b]);
  vz[0] -= getZUpdate(0, 1) + getZUpdate(0, 2) + getZUpdate(0, 3);
  vz[1] -= getZUpdate(1, 0) + getZUpdate(1, 2) + getZUpdate(1, 3);
  vz[2] -= getZUpdate(2, 0) + getZUpdate(2, 1) + getZUpdate(2, 3);
  vz[3] -= getZUpdate(3, 0) + getZUpdate(3, 1) + getZUpdate(3, 2);
}

function updatePosX() {
  x[0] += vx[0];
  x[1] += vx[1];
  x[2] += vx[2];
  x[3] += vx[3];
}

function updatePosY() {
  y[0] += vy[0];
  y[1] += vy[1];
  y[2] += vy[2];
  y[3] += vy[3];
}

function updatePosZ() {
  z[0] += vz[0];
  z[1] += vz[1];
  z[2] += vz[2];
  z[3] += vz[3];
}

function serialize(pos: number[], vel: number[]): string {
  return pos.join(",") + "," + vel.join(",");
}

function lcmVanDarragh(elements: number[]): number {
  const ref = Math.max(...elements);
  let i = 0;
  while (true) {
    i++;
    if (!elements.some(val => (i * ref) % val !== 0)) {
      return i * ref;
    }
  }
}
