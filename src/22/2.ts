import * as fs from "fs";
import * as assert from "assert";

type Deal = { type: "NEW" | "INC" | "CUT"; value: number };

function unshuffleVars(
  inputFile: string,
  deckSize: number
): { mult: number; add: number } {
  const input: Deal[] = fs
    .readFileSync(inputFile, "utf8")
    .split("\n")
    .map(val => interpret(val))
    .filter(val => val !== undefined) as Deal[];

  // Reach a state where unshuffling according to the inputfile is the
  // same as (mult * x + add) % deckSize
  let mult = 1;
  let add = 0;

  for (const op of input.reverse()) {
    if (op.type === "NEW") {
      // from 2a: deckSize - 1 - state
      // => (-1) * state + (deckSize - 1)
      mult = posMod(-mult, deckSize);
      add = posMod(-add + (deckSize - 1), deckSize);
    } else if (op.type === "CUT") {
      // from 2a: state + op.value
      // => state + op.value
      add = posMod((add + op.value) % deckSize, deckSize);
    } else if (op.type === "INC") {
      // from 2a: state * modInverse(op.value, deckSize)
      // => (modInverse(op.value, deckSize)) * state
      const inverse = modInverse(op.value, deckSize);
      mult = posMod(mult * inverse, deckSize);
      add = posMod(add * inverse, deckSize);
    }
  }
  return { add, mult };
}

function interpret(input: string): Deal | undefined {
  if (input.includes("deal into new")) {
    return { type: "NEW", value: 0 };
  } else if (input.includes("cut")) {
    return { type: "CUT", value: Number(input.substring(4)) };
  } else if (input.includes("increment")) {
    return { type: "INC", value: Number(input.substring(20)) };
  }
  return undefined;
}

function posMod(a: number, m: number): number {
  return (a + Math.ceil(Math.abs(a) / m) * m) % m;
}

function modInverse(a: number, m: number) {
  a = ((a % m) + m) % m;

  const s = [];
  let b = m;
  while (b) {
    [a, b] = [b, a % b];
    s.push({ a, b });
  }

  let x = 1;
  let y = 0;
  for (let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)];
  }
  return ((y % m) + m) % m;
}

// attempt to reduce the amount of iterations:
// mult * (mult * X + add) + add => mult^2 * X + mult * add + add
// This cuts the amount of iterations in half
function reduceMultipleParameters(
  iterations: number,
  mod: number,
  mult: number,
  add: number
): { mult: number; add: number } {
  if (iterations === 1) {
    return { mult, add };
  } else if (iterations === 2) {
    return { mult: mult ** 2 % mod, add: (mult * add + add) % mod };
  } else {
    let itTemp = iterations;
    let muTemp = mult;
    let adTemp = add;
    if (itTemp % 2 === 1) {
      muTemp = muTemp ** 2 % mod;
      adTemp = (muTemp * adTemp + adTemp) % mod;
      itTemp--;
    }
    return reduceMultipleParameters(itTemp / 2, mod, muTemp, adTemp);
  }
}

const vars = unshuffleVars("input", 119315717514047);
const reducedVars = reduceMultipleParameters(
  101741582076661,
  119315717514047,
  vars.mult,
  vars.add
);

console.log((vars.mult * 2020 + vars.add) % 119315717514047);
