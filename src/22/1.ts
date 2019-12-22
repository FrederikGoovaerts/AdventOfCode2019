import * as fs from "fs";

type Deal = { type: "NEW" | "INC" | "CUT"; value: number };

const input: Deal[] = fs
  .readFileSync("input", "utf8")
  .split("\n")
  .map(val => interpret(val))
  .filter(val => val !== undefined) as Deal[];

let tempDeck = new Array(10007);
tempDeck.fill(0);
let deck = tempDeck.map((val, ind) => ind);

for (const op of input) {
  if (op.type === "NEW") {
    deck = newStack(deck);
  } else if (op.type === "CUT") {
    deck = cut(deck, op.value);
  } else if (op.type === "INC") {
    deck = inc(deck, op.value);
  }
}
console.log(deck.indexOf(2019));

// helpers
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

function newStack(deck: number[], val = 0): number[] {
  return deck.reverse();
}

function cut(deck: number[], cutVal: number): number[] {
  let cutValMod = cutVal < 0 ? cutVal + deck.length : cutVal;
  return deck.slice(cutValMod, deck.length).concat(deck.slice(0, cutValMod));
}

function inc(deck: number[], incVal: number): number[] {
  const newDeck = [];
  let incCount = 0;
  for (const el of deck) {
    newDeck[incCount] = el;
    incCount = (incCount + incVal) % deck.length;
  }
  return newDeck;
}
