import * as fs from "fs";
import { intcode, feedbackType } from "../shared/intcode";

const RENDER = false;

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);
input[0] = 2;
const screen: number[][] = [];
let score: number = 0;

let paddleX = 0;
let ballX = 0;

const runner = intcode(input);
start();

async function start() {
  let initDone = false;
  while (true) {
    const xRes = getNextOutput();
    if (xRes === undefined) {
      break;
    }
    const yRes = getNextOutput()!;
    const valRes = getNextOutput()!;
    const x = xRes[0];
    const y = yRes[0];
    const val = valRes[0];
    if (initDone && (xRes[1] || yRes[1] || valRes[1]) && RENDER) {
      await new Promise(res => {
        setTimeout(res, 10);
      });
      renderScreen();
    }
    if (x === -1 && y === 0) {
      initDone = true;
      score = val;
    } else {
      const arr = screen[y] ?? [];
      arr[x] = val;
      screen[y] = arr;
    }
    if (val === 4) {
      ballX = x;
    }
    if (val === 3) {
      paddleX = x;
    }
  }
  console.log(score);
}

function getNextOutput(): [number, boolean] | undefined {
  let hadInput = false;
  let next = runner.next();
  if (next.value.type === feedbackType.INPUT) {
    hadInput = true;
    if (ballX === paddleX) {
      next = runner.next(0);
    } else {
      next = runner.next((ballX - paddleX) / Math.abs(ballX - paddleX));
    }
  }
  if (next.value.type === feedbackType.OUTPUT) {
    return [next.value.output, hadInput];
  }
  if (next.value.type === feedbackType.HALT) {
    return undefined;
  }
}

function renderScreen() {
  console.log();
  let result = "";
  screen.forEach((arr: number[], i: number) => {
    result += arr.map(val => prettify(val)).join("") + "\n";
  });
  console.log(result + `score: ${score}`);
}

function prettify(input: number): string {
  switch (input) {
    case 0:
      return " ";
    case 1:
      return "#";
    case 2:
      return "=";
    case 3:
      return "_";
    case 4:
      return "o";
    default:
      return "?";
  }
}
