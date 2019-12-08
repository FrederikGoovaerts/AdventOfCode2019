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

let currentBest = Infinity;
let currentLayer: number[] = [];
for (const layer of layers) {
  const nbOfZeroes = layer.filter(val => val === 0).length;
  if (nbOfZeroes < currentBest) {
    currentBest = nbOfZeroes;
    currentLayer = layer;
  }
}

console.log(
  currentLayer.filter(val => val === 1).length *
    currentLayer.filter(val => val === 2).length
);
