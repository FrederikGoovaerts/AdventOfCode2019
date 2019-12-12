import * as fs from "fs";
import * as crypto from "crypto";

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
const states: Set<string> = new Set();

let count = 0;
states.add(serialize());
while (true) {
  timeStep();
  count++;
  if (vx.includes(0) || vy.includes(0) || vz.includes(0)) {
    const state = serialize();
    if (states.has(state)) {
      console.log(count);
      break;
    }
    states.add(state);
  }
}

function timeStep() {
  updateVel();
  updatePos();
}

function updateVel() {
  const getXUpdate = (a: 0 | 1 | 2 | 3, b: 0 | 1 | 2 | 3) =>
    x[a] === x[b] ? 0 : (x[a] - x[b]) / Math.abs(x[a] - x[b]);
  const getYUpdate = (a: 0 | 1 | 2 | 3, b: 0 | 1 | 2 | 3) =>
    y[a] === y[b] ? 0 : (y[a] - y[b]) / Math.abs(y[a] - y[b]);
  const getZUpdate = (a: 0 | 1 | 2 | 3, b: 0 | 1 | 2 | 3) =>
    z[a] === z[b] ? 0 : (z[a] - z[b]) / Math.abs(z[a] - z[b]);
  vx[0] -= getXUpdate(0, 1) + getXUpdate(0, 2) + getXUpdate(0, 3);
  vx[1] -= getXUpdate(1, 0) + getXUpdate(1, 2) + getXUpdate(1, 3);
  vx[2] -= getXUpdate(2, 0) + getXUpdate(2, 1) + getXUpdate(2, 3);
  vx[3] -= getXUpdate(3, 0) + getXUpdate(3, 1) + getXUpdate(3, 2);
  vy[0] -= getYUpdate(0, 1) + getYUpdate(0, 2) + getYUpdate(0, 3);
  vy[1] -= getYUpdate(1, 0) + getYUpdate(1, 2) + getYUpdate(1, 3);
  vy[2] -= getYUpdate(2, 0) + getYUpdate(2, 1) + getYUpdate(2, 3);
  vy[3] -= getYUpdate(3, 0) + getYUpdate(3, 1) + getYUpdate(3, 2);
  vz[0] -= getZUpdate(0, 1) + getZUpdate(0, 2) + getZUpdate(0, 3);
  vz[1] -= getZUpdate(1, 0) + getZUpdate(1, 2) + getZUpdate(1, 3);
  vz[2] -= getZUpdate(2, 0) + getZUpdate(2, 1) + getZUpdate(2, 3);
  vz[3] -= getZUpdate(3, 0) + getZUpdate(3, 1) + getZUpdate(3, 2);
}

function updatePos() {
  x[0] += vx[0];
  x[1] += vx[1];
  x[2] += vx[2];
  x[3] += vx[3];
  y[0] += vy[0];
  y[1] += vy[1];
  y[2] += vy[2];
  y[3] += vy[3];
  z[0] += vz[0];
  z[1] += vz[1];
  z[2] += vz[2];
  z[3] += vz[3];
}

function serialize(): string {
  return crypto
    .createHash("md5")
    .update(
      "" +
        x.join("") +
        y.join("") +
        z.join("") +
        vx.join("") +
        vy.join("") +
        vz.join("")
    )
    .digest("hex");
}
