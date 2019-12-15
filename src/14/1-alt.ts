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

const reactions: Map<string, ReactionResult> = new Map();

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
  if (reactions.has(res.id)) {
    throw new Error("We do not support multiple options yet!");
  }
  reactions.set(res.id, { nb: res.nb, reqs });
});

console.log(generateFuel(1));

// Helpers

function generateFuel(amount: number): number {
  let oreCounter = 0;
  const refinery = new Map<string, number>();
  refinery.set("FUEL", amount);
  const waste = new Map<string, number>();
  while (refinery.size !== 0) {
    // Loop over keys because values might increase while handling other elements
    for (const prod of refinery.keys()) {
      const amount = refinery.get(prod)!;
      const reaction = reactions.get(prod)!;
      const reactionRuns = Math.ceil(amount / reaction.nb);
      const generated = reaction.nb * reactionRuns;
      refinery.delete(prod);
      if (generated > amount) {
        waste.set(prod, (waste.get(prod) ?? 0) + (generated - amount));
      }
      reaction.reqs.forEach(req => {
        if (req.id === "ORE") {
          oreCounter += req.nb * reactionRuns;
        } else {
          const amountInWaste = waste.get(req.id) ?? 0;
          const needed = reactionRuns * req.nb;
          if (amountInWaste >= needed) {
            waste.set(req.id, amountInWaste - needed);
          } else {
            waste.set(req.id, 0);
            const toGenerate = needed - amountInWaste;
            refinery.set(req.id, (refinery.get(req.id) ?? 0) + toGenerate);
          }
        }
      });
    }
  }
  return oreCounter;
}
