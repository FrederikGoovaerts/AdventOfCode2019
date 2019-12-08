import * as fs from "fs";
import { intcode } from "../shared/intcode";

const input = fs
  .readFileSync("input", "utf8")
  .split('\n')[0]
  .split(",")
  .map(Number);

function generateSettings(length: number, start: number): number[][] {
  return generateSettingsRec(new Array(length).fill(-1), start, (new Array(length)).fill(0).map((val,index)=> index));
}

function generateSettingsRec(acc: number[], curr: number, openLocs: number[]): number[][] {
  if(openLocs.length === 0) {
    return [acc];
  }
  let result: number[][] = [];
  for(const loc of openLocs) {
    const res = [...acc]
    res[loc] = curr;
    result = result.concat(generateSettingsRec(res, curr + 1, openLocs.filter((val) => val !== loc)));
  }
  return result;
}

const combinations = generateSettings(5, 5);

let currentBest = 0;
for (const combination of combinations) {
  const amps = [];
  for (let i = 0; i < 5; i++) {
    const amp = intcode([...input]);
    let shouldBeUndef = amp.next();
    shouldBeUndef = amp.next(combination[i]);
    amps.push(amp);
  }
  let currentInput = 0;
  let currentAmp = 0;
  while(true) {
    const out = amps[currentAmp].next(currentInput); // Give input and yield output
    if (out.done) {
      break;
    }
    if (out.value === undefined) {
      throw new Error('OUTSTATE INCORRECT ' + currentAmp + ' ' + out.value);
    }
    currentInput = out.value;
    amps[currentAmp].next(); // Run until next request for input
    currentAmp = (currentAmp + 1) % 5;
  }
  if (currentInput > currentBest) {
    currentBest = currentInput;
  }
}
console.log(currentBest);


