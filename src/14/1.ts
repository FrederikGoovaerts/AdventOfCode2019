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
  if (reactions[res.id] !== undefined) {
    throw new Error("We do not support multiple options yet!");
  }
  reactions[res.id] = { nb: res.nb, reqs };
});

let oreCounter = 0;
const refinery = ["FUEL"];
const waste: string[] = [];
while (!(refinery.length === 0)) {
  const nextProd = refinery.shift()!;
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
      oreCounter += req.nb;
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
console.log(oreCounter);
