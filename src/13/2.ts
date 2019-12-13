import * as fs from "fs";
import { intcodeNext, feedback, feedbackType } from "../shared/intcode-next";

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

const runner = intcodeNext(input);
start();

async function start() {
  let initDone = false;
  while (true) {
    const x = getNextOutput();
    const y = getNextOutput();
    const val = getNextOutput();
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
    if (initDone) {
      // await new Promise(resolve => {
      //   setTimeout(resolve, 300);
      // });
      renderScreen();
    }
  }
}

function getNextOutput(): number {
  let next = runner.next();
  while (next.value.type === feedbackType.INPUT) {
    if (ballX === paddleX) {
      next = runner.next(0);
    } else {
      next = runner.next((ballX - paddleX) / Math.abs(ballX - paddleX));
    }
  }
  if (next.value.type === feedbackType.OUTPUT) {
    return next.value.output;
  }
  throw new Error("wrong state bud");
}

function renderScreen() {
  console.log();
  let ball = -1;
  let paddle = -1;
  screen.forEach((arr: number[], i: number) => {
    console.log(arr.map(val => prettify(val)).join(""));
  });
  console.log(`score: ${score}`);
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
