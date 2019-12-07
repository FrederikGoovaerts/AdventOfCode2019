import * as fs from "fs";

const input = fs
  .readFileSync("input", "utf8")
  .split('\n')[0]
  .split(",")
  .map(Number);

function* run(programBase: number[], name: number): Generator<number | undefined, undefined, number> {
  const program = [...programBase];
  let instructionPointer: number = 0;

  while (instructionPointer >= 0) {
    const operation = program[instructionPointer] % 100;
    const modes = String(Math.floor(program[instructionPointer] / 100))
      .split("")
      .reverse()
      .map(Number)
      .concat(0, 0, 0, 0);

    switch (operation) {
      case 1:
        add(modes);
        break;
      case 2:
        multiply(modes);
        break;
      case 3: {
        const input = yield undefined;
        put(instructionPointer + 1, input);
        instructionPointer += 2;
        break;
      }
      case 4: {
        const output = get(instructionPointer + 1, modes[0]);
        yield output;
        instructionPointer += 2;
        break;
      }
      case 5:
        jumpIf(true, modes);
        break;
      case 6:
        jumpIf(false, modes);
        break;
      case 7:
        check((a, b) => a < b, modes);
        break;
      case 8:
        check((a, b) => a === b, modes);
        break;
      case 99:
        halt();
        break;
      default:
        throw new Error(`OPCODE: ${program[instructionPointer]}`);
    }
  }

  return undefined;

  // General utility

  function get(value: number, mode: number): number {
    switch (mode) {
      case 0:
        return program[program[value]];
      default:
      case 1:
        return program[value];
    }
  }

  function put(loc: number, value: number): void {
    program[program[loc]] = value;
  }

  // OPcode implementations

  // 01: add
  function add(modes: number[]): void {
    const a = get(instructionPointer + 1, modes[0]);
    const b = get(instructionPointer + 2, modes[1]);
    put(instructionPointer + 3, a + b);

    instructionPointer += 4;
  }

  // 02: multiply
  function multiply(modes: number[]): void {
    const a = get(instructionPointer + 1, modes[0]);
    const b = get(instructionPointer + 2, modes[1]);
    put(instructionPointer + 3, a * b);

    instructionPointer += 4;
  }

  // 05: jump-if-true
  // 06: jump-if-false
  function jumpIf(req: boolean, modes: number[]): void {
    if ((get(instructionPointer + 1, modes[0]) !== 0) === req) {
      instructionPointer = get(instructionPointer + 2, modes[1]);
    } else {
      instructionPointer += 3;
    }
  }

  // 07: less-than
  // 08: equals
  function check(
    checker: (a: number, b: number) => boolean,
    modes: number[]
  ): void {
    const a = get(instructionPointer + 1, modes[0]);
    const b = get(instructionPointer + 2, modes[1]);
    if (checker(a, b)) {
      put(instructionPointer + 3, 1);
    } else {
      put(instructionPointer + 3, 0);
    }

    instructionPointer += 4;
  }

  // 99: halt
  function halt(): void {
    instructionPointer = -1;
  }
}

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
    const amp = run([...input], i);
    let shouldBeUndef = amp.next();
    if (shouldBeUndef.value !== undefined) {
      throw new Error('STARTUP INCORRECT');
    }
    shouldBeUndef = amp.next(combination[i]);
    if (shouldBeUndef.value !== undefined) {
      throw new Error('STARTUP INCORRECT');
    }
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


