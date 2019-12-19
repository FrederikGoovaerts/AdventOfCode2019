import * as fs from "fs";
import assert from "assert";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

let counterX = 0;
let counterY = 0;
while (true) {
  let resX = 0;
  let resY = 0;
  for (let x = counterX; x >= 0; x--) {
    let gotOne = false;
    const runner = intcode(input);
    let next = runner.next();
    next = runner.next(x);
    next = runner.next(counterY);
    if (next.value.type === "OUTPUT") {
      resX += next.value.output;
      if (next.value.output === 0) {
        if (gotOne) {
          break;
        }
      } else {
        gotOne = true;
      }
    }
  }
  for (let y = counterY; y >= 0; y--) {
    let gotOne = false;
    const runner = intcode(input);
    let next = runner.next();
    next = runner.next(counterX);
    next = runner.next(y);
    if (next.value.type === "OUTPUT") {
      resY += next.value.output;
      if (next.value.output === 0) {
        if (gotOne) {
          break;
        }
      } else {
        gotOne = true;
      }
    }
  }
  if (resX >= 100 && resY >= 100) {
    break;
  }
  if (resX >= resY) {
    counterY += Math.max(0, 100 - resY);
  }
  if (resY >= resX) {
    counterX += Math.max(0, 100 - resX);
  }
}

let newMatch = true;
while (newMatch) {
  let xMatch = counterX - 1;
  newMatch = false;
  for (let yMatch = counterY - 1; yMatch >= counterY - 12; yMatch--) {
    let resX = 0;
    let resY = 0;
    for (let x = xMatch; x >= 0; x--) {
      const runner = intcode(input);
      let next = runner.next();
      next = runner.next(x);
      next = runner.next(yMatch);
      if (next.value.type === "OUTPUT") {
        resX += next.value.output;
        if (next.value.output === 0) {
          break;
        }
      }
    }
    for (let y = yMatch; y >= 0; y--) {
      const runner = intcode(input);
      let next = runner.next();
      next = runner.next(xMatch);
      next = runner.next(y);
      if (next.value.type === "OUTPUT") {
        resY += next.value.output;
        if (next.value.output === 0) {
          break;
        }
      }
    }
    if (resX >= 100 && resY >= 100) {
      newMatch = true;
      counterX = xMatch;
      counterY = yMatch;
      break;
    }
  }
}
console.log((counterX - 99) * 10000 + (counterY - 99));
