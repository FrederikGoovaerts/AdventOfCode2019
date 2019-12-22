import * as fs from "fs";
import * as assert from "assert";

type Deal = { type: "NEW" | "INC" | "CUT"; value: number };

function indexOfCard(
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
  for (const op of input) {
    if (op.type === "NEW") {
      state = stack(state, deckSize);
    } else if (op.type === "CUT") {
      state = cut(state, op.value, deckSize);
    } else if (op.type === "INC") {
      state = inc(state, op.value, deckSize);
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

function stack(val: number, deckSize: number): number {
  return deckSize - 1 - val;
}

function cut(val: number, cutVal: number, deckSize: number): number {
  return posMod(val - cutVal, deckSize);
}

function inc(val: number, incVal: number, deckSize: number): number {
  return posMod(val * incVal, deckSize);
}

function posMod(a: number, m: number): number {
  return (a + Math.ceil(Math.abs(a) / m) * m) % m;
}

console.log(indexOfCard("input", 2019, 10007));
