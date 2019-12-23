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
  let mult = 1n;
  let add = 0n;

  for (const op of input.reverse()) {
    if (op.type === "NEW") {
      // from 2a: deckSize - 1 - state
      // => (-1) * state + (deckSize - 1)
      mult = posMod(-mult, BigInt(deckSize));
      add = posMod(-add + BigInt(deckSize - 1), BigInt(deckSize));
    } else if (op.type === "CUT") {
      // from 2a: state + op.value
      // => state + op.value
      add = posMod(
        (add + BigInt(op.value)) % BigInt(deckSize),
        BigInt(deckSize)
      );
    } else if (op.type === "INC") {
      // from 2a: state * modInverse(op.value, deckSize)
      // => (modInverse(op.value, deckSize)) * state
      const inverse = modInverse(op.value, deckSize);
      mult = posMod(mult * BigInt(inverse), BigInt(deckSize));
      add = posMod(add * BigInt(inverse), BigInt(deckSize));
    }
  }
  return { add: Number(add), mult: Number(mult) };
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

function posMod(a: bigint, m: bigint): bigint {
  return (a + m) % m;
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
  iterations: bigint,
  mod: bigint,
  mult: bigint,
  add: bigint
): { mult: bigint; add: bigint } {
  if (iterations === 1n) {
    return { mult, add };
  } else if (iterations % 2n === 0n) {
    return reduceMultipleParameters(
      iterations / 2n,
      mod,
      mult ** 2n % mod,
      (mult * add + add) % mod
    );
  } else {
    const temp = reduceMultipleParameters(iterations - 1n, mod, mult, add);
    return {
      mult: (mult * temp.mult) % mod,
      add: (add + mult * temp.add) % mod
    };
  }
}

const vars = unshuffleVars("input", 119315717514047);
const reducedVars = reduceMultipleParameters(
  101741582076661n,
  119315717514047n,
  BigInt(vars.mult),
  BigInt(vars.add)
);

console.log(
  Number((reducedVars.mult * 2020n + reducedVars.add) % 119315717514047n)
);
