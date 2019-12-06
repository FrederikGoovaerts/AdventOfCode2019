import * as fs from "fs";

// Read input
const contents: string[] = fs.readFileSync("input", "utf8").split("\n");

const fuels = [];
for (const line of contents) {
  if (line !== "") {
    const moduleFuel = Math.floor(Number(line) / 3) - 2;
    fuels.push(moduleFuel);
    let currentFuel = moduleFuel;
    while (currentFuel > 6) {
      currentFuel = Math.floor(currentFuel / 3) - 2;
      fuels.push(currentFuel);
    }
  }
}

console.log(fuels.reduce((a, b) => a + b));
