import * as fs from "fs";
import { intcode, feedback } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split(",")
  .map(Number);

const messageQueue = new Map<number, Array<[number, number]>>();
for (let i = 0; i < 50; i++) {
  messageQueue.set(i, []);
}

const computers = new Map<number, Generator>();
for (let i = 0; i < 50; i++) {
  const runner = intcode(input);
  computers.set(i, runner);
  runner.next();
  let next = runner.next(i);
  while (next.value.type === "OUTPUT") {
    const addr = next.value.output;
    const x = (runner.next().value as { type: "OUTPUT"; output: number })
      .output;
    const y = (runner.next().value as { type: "OUTPUT"; output: number })
      .output;
    messageQueue.get(addr)!.push([x, y]);
    next = runner.next();
  }
}
let natX = NaN;
let natY = NaN;
let lastY = NaN;

while (true) {
  let idle = true;
  for (let i = 0; i < 50; i++) {
    const computer = computers.get(i)!;
    const queue = messageQueue.get(i)!;
    let next: any;
    if (queue.length === 0) {
      next = computer.next(-1);
    } else if (queue.length > 0) {
      idle = false;
      const message = queue.shift()!;
      computer.next(message[0]);
      next = computer.next(message[1]);
    }
    while (next.value.type === "OUTPUT") {
      const addr = next.value.output;
      const x = (computer.next().value as { type: "OUTPUT"; output: number })
        .output;
      const y = (computer.next().value as { type: "OUTPUT"; output: number })
        .output;
      if (addr === 255) {
        natX = x;
        natY = y;
      } else {
        messageQueue.get(addr)!.push([x, y]);
      }
      next = computer.next();
    }
  }
  if (idle) {
    if (lastY === natY) {
      console.log(natY);
      break;
    }
    messageQueue.get(0)!.push([natX, natY]);
    lastY = natY;
  }
}
