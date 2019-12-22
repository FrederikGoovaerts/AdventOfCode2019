import * as fs from "fs";
import * as assert from "assert";

type Deal = { type: "NEW" | "INC" | "CUT"; value: number };

function cardAtIndex(
  inputFile: string,
  value: number,
  deckSize: number
): number {
  const input: Deal[] = fs
    .readFileSync(inputFile, "utf8")
    .split("\n")
    .map(val => interpret(val))
    .filter(val => val !== undefined) as Deal[];

  let state = value;
  for (const op of input.reverse()) {
    if (op.type === "NEW") {
      state = unstack(state, deckSize);
    } else if (op.type === "CUT") {
      state = uncut(state, op.value, deckSize);
    } else if (op.type === "INC") {
      state = uninc(state, op.value, deckSize);
    }
  }
  return state;
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

function unstack(val: number, deckSize: number): number {
  return deckSize - 1 - val;
}

function uncut(val: number, cutVal: number, deckSize: number): number {
  return posMod(val + cutVal, deckSize);
}

function uninc(val: number, incVal: number, deckSize: number): number {
  return posMod(val * modInverse(incVal, deckSize), deckSize);
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

console.log(cardAtIndex("input", 3377, 10007));
