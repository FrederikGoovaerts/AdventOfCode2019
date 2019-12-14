import * as fs from "fs";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split("\n");

interface Amount {
  id: string;
  nb: number;
}

interface ReactionResult {
  reqs: Amount[];
  nb: number;
}

const reactions: Record<string, ReactionResult> = {};

input.forEach(line => {
  const toAmount = (input: string): Amount => ({
    id: input.split(" ")[1],
    nb: Number(input.split(" ")[0])
  });
  const reqs = line
    .split(" => ")[0]
    .split(", ")
    .map(toAmount);
  const res = toAmount(line.split(" => ")[1]);
  reactions[res.id] = { nb: res.nb, reqs };
});

const waste: string[] = [];

// Stuff for later calculation
const wasteStates: string[] = [];
const priceTrend: number[] = [];
let repeatStart = -1;
let init = 0;
let initLength = 0;
let repeated = 0;
let repeatedLength = 0;

while (true) {
  const price = performDistillation();
  const wasteString = waste.sort().join(",");

  if (wasteStates.includes(wasteString)) {
    repeatStart = wasteStates.indexOf(wasteString);
    initLength = repeatStart;
    repeatedLength = priceTrend.length - repeatedLength;
    for (let i = 0; i < repeatStart; i++) {
      init += priceTrend[i];
    }
    for (let i = repeatStart; i < priceTrend.length; i++) {
      repeated += priceTrend[i];
    }
    break;
  }
  priceTrend.push(price);
  wasteStates.push(wasteString);
}

let fuel = initLength;
let ore = 1000000000000 - init;
// First we take off some big chunks
while (ore >= repeated) {
  ore -= repeated;
  fuel += repeatedLength;
}
// Then we tip-toe to the solution
let index = repeatStart;
while (priceTrend[index] <= ore) {
  fuel++;
  ore -= priceTrend[index];
  index++;
  if (index >= priceTrend.length) {
    index = repeatStart;
  }
}
console.log(fuel, ore);

// Helpers

function performDistillation(): number {
  const refinery = ["FUEL"];
  let orePrice = 0;
  while (!(refinery.length === 0)) {
    const nextProd = refinery.pop()!;
    const reaction = reactions[nextProd];
    for (let i = 1; i < reaction.nb; i++) {
      if (refinery.includes(nextProd)) {
        refinery.splice(refinery.indexOf(nextProd), 1);
      } else {
        waste.push(nextProd);
      }
    }
    reaction.reqs.forEach(req => {
      if (req.id === "ORE") {
        orePrice += req.nb;
      } else {
        for (let i = 0; i < req.nb; i++) {
          if (waste.includes(req.id)) {
            waste.splice(waste.indexOf(req.id), 1);
          } else {
            refinery.push(req.id);
          }
        }
      }
    });
  }
  return orePrice;
}
