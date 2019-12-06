import * as fs from "fs";

// Read input
const contents: string[] = fs.readFileSync("input", "utf8").split("\n");

const fuels = [];
for (const line of contents) {
  if (line !== "") {
    fuels.push(Math.floor(Number(line) / 3) - 2);
  }
}

console.log(fuels.reduce((a, b) => a + b));
