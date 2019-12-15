export enum feedbackType {
  HALT = "HALT",
  INPUT = "INPUT",
  OUTPUT = "OUTPUT"
}
export type feedback =
  | { type: feedbackType.HALT; output: number[] }
  | { type: feedbackType.INPUT }
  | { type: feedbackType.OUTPUT; output: number };

export function* intcode(
  programBase: number[]
): Generator<feedback, { type: undefined }, number> {
  const endPadding = new Array(200000);
  endPadding.fill(0);
  const program = [...programBase].concat(endPadding);
  let instructionPointer: number = 0;
  let relativeOffset: number = 0;

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
        const input = yield { type: feedbackType.INPUT };
        put(instructionPointer + 1, input, modes[0]);
        instructionPointer += 2;
        break;
      }
      case 4: {
        const output = get(instructionPointer + 1, modes[0]);
        yield { type: feedbackType.OUTPUT, output };
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
      case 9:
        relativeUpdate(modes);
        break;
      case 99:
        halt();
        yield { type: feedbackType.HALT, output: program };
        break;
      default:
        throw new Error(`OPCODE: ${program[instructionPointer]}`);
    }
  }

  return { type: undefined };

  // General utility

  function get(value: number, mode: number): number {
    switch (mode) {
      case 0:
        return program[program[value]];
      case 1:
        return program[value];
      case 2:
        return program[relativeOffset + program[value]];
    }
    return -1;
  }

  function put(loc: number, value: number, mode: number): void {
    switch (mode) {
      case 0:
        program[program[loc]] = value;
        break;
      case 2:
        program[relativeOffset + program[loc]] = value;
        break;
    }
  }

  // OPcode implementations

  // 01: add
  function add(modes: number[]): void {
    const a = get(instructionPointer + 1, modes[0]);
    const b = get(instructionPointer + 2, modes[1]);
    put(instructionPointer + 3, a + b, modes[2]);

    instructionPointer += 4;
  }

  // 02: multiply
  function multiply(modes: number[]): void {
    const a = get(instructionPointer + 1, modes[0]);
    const b = get(instructionPointer + 2, modes[1]);
    put(instructionPointer + 3, a * b, modes[2]);

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
      put(instructionPointer + 3, 1, modes[2]);
    } else {
      put(instructionPointer + 3, 0, modes[2]);
    }

    instructionPointer += 4;
  }

  // 09: update relative offset
  function relativeUpdate(modes: number[]): void {
    relativeOffset += get(instructionPointer + 1, modes[0]);
    instructionPointer += 2;
  }

  // 99: halt
  function halt(): void {
    instructionPointer = -1;
  }
}
