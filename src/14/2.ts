import * as fs from "fs";

const input = fs
  .readFileSync("input", "utf8")
  .trim()
  .split("\n");

// First we build up the graph from end to beginning as a map

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

// Then we calculate the exact ore cost of creating one element without respecting the amounts created

const generationTable: Record<string, number> = {};

function calculateFor(input: string) {
  const formula = reactions[input];
  if (formula.reqs[0].id === "ORE") {
    generationTable[input] = formula.reqs[0].nb / formula.nb;
  } else {
    let cost = 0;
    formula.reqs.forEach(req => {
      if (generationTable[req.id] === undefined) {
        calculateFor(req.id);
      }
      const reqCost = generationTable[req.id];
      cost += reqCost * req.nb;
    });
    generationTable[input] = cost / formula.nb;
  }
}
calculateFor("FUEL");

// Use marginal cost for one FUEL to approximate how many we would be able to make without calculating waste

console.log(Math.floor(1000000000000 / generationTable["FUEL"]));
