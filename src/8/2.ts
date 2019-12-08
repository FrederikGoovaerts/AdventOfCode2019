import * as fs from "fs";

const input: number[] = fs
  .readFileSync("input", "utf8")
  .trim()
  .split("")
  .map((n: string) => Number(n));

const height = 6;
const width = 25;
const pixels = height * width;
const amountOfLayers = input.length / pixels;

const layers: number[][] = new Array(amountOfLayers);
for (let i = 0; i < layers.length; i++) {
  layers[i] = [];
}

for (let i = 0; i < input.length; i++) {
  layers[Math.floor(i / pixels)].push(input[i]);
}

function getPixel(pos: number): number {
  for (let i = 0; i < layers.length; i++) {
    if (layers[i][pos] !== 2) {
      return layers[i][pos];
    }
  }
  return 2;
}

const result: number[] = [];
for (let i = 0; i < pixels; i++) {
  result.push(getPixel(i));
}
for (let i = 0; i < height; i++) {
  console.log(
    result
      .map(val => (val === 1 ? "##" : "  "))
      .slice(i * width, (i + 1) * width)
      .join("")
  );
}
