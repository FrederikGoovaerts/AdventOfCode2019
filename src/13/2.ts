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

let paddleSynced = false;
let direction = 1;
let ballY = 0;

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
    if (initDone) {
      await new Promise(resolve => {
        setTimeout(resolve, 300);
      });
      renderScreen();
    }
  }
}

function getNextOutput(): number {
  let next = runner.next();
  while (next.value.type === feedbackType.INPUT) {
    if (ballY === screen.length - 3) {
      next = runner.next(0);
      direction = -direction;
    } else {
      next = runner.next(paddleSynced ? 0 : direction);
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
    if (ball === -1) {
      ball = arr.indexOf(4);
      if (ball !== -1) {
        ballY = i;
        if (arr[ball + direction] !== 0) {
          direction = -direction;
        }
      }
    }
    if (paddle === -1) {
      paddle = arr.indexOf(3);
    }
    console.log(arr.map(val => prettify(val)).join(""));
  });
  console.log(`score: ${score}, direction: ${direction}`);
  if (ball === -1 || paddle === -1) {
    return;
  }
  paddleSynced = direction === 1 ? paddle > ball : paddle < ball;
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
