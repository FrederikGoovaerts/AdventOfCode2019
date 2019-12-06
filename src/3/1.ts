import * as fs from "fs";

type LineDirections = string[];
interface Coordinate {
  x: number;
  y: number;
}
interface Line {
  p1: Coordinate;
  p2: Coordinate;
}

// Read input
const input: LineDirections[] = fs
  .readFileSync("input", "utf8")
  .split("\n")
  .map((val: string) => val.split(","));

// input is two wires
const firstWireDirections = input[0];
const secondWireDirections = input[1];

const firstWireLines = toLines(firstWireDirections);
const secondWireLines = toLines(secondWireDirections);

let closestPoint: Coordinate = { x: Infinity, y: Infinity };
for (const lineA of firstWireLines) {
  for (const lineB of secondWireLines) {
    if (intersect(lineA, lineB)) {
      const [ta, tb] = getIntersection(lineA, lineB);
      const point: Coordinate = {
        x: lineA.p1.x + ta * (lineA.p2.x - lineA.p1.x),
        y: lineA.p1.y + ta * (lineA.p2.y - lineA.p1.y)
      };
      if (
        Math.abs(point.x) + Math.abs(point.y) <
        Math.abs(closestPoint.x) + Math.abs(closestPoint.y)
      ) {
        closestPoint = point;
      }
    }
  }
}

console.log(closestPoint.x + closestPoint.y);

// Helpers

function toLines(directions: string[]): Line[] {
  let currX = 0;
  let currY = 0;
  const result: Line[] = [];
  for (const dir of directions) {
    const [cardinal, ...rawDistance] = dir;
    const distance = Number(rawDistance.join(""));
    switch (cardinal) {
      case "U": {
        result.push(lineFrom(currX, currY, 0, distance));
        currY += distance;
        break;
      }
      case "D": {
        result.push(lineFrom(currX, currY, 0, -distance));
        currY -= distance;
        break;
      }
      case "L": {
        result.push(lineFrom(currX, currY, -distance, 0));
        currX -= distance;
        break;
      }
      case "R": {
        result.push(lineFrom(currX, currY, distance, 0));
        currX += distance;
        break;
      }
      default:
        break;
    }
  }
  return result;
}

function lineFrom(
  x: number,
  y: number,
  offsetX: number,
  offsetY: number
): Line {
  return { p1: { x, y }, p2: { x: x + offsetX, y: y + offsetY } };
}

function intersect(a: Line, b: Line): boolean {
  const t = getIntersection(a, b);
  return 0 <= t[0] && t[0] <= 1 && 0 <= t[1] && t[1] <= 1;
}

function getIntersection(a: Line, b: Line): [number, number] {
  const x1 = a.p1.x;
  const x2 = a.p2.x;
  const x3 = b.p1.x;
  const x4 = b.p2.x;
  const y1 = a.p1.y;
  const y2 = a.p2.y;
  const y3 = b.p1.y;
  const y4 = b.p2.y;
  const ta: number =
    ((y3 - y4) * (x1 - x3) + (x4 - x3) * (y1 - y3)) /
    ((x4 - x3) * (y1 - y2) - (x1 - x2) * (y4 - y3));
  const tb: number =
    ((y1 - y2) * (x1 - x3) + (x2 - x1) * (y1 - y3)) /
    ((x4 - x3) * (y1 - y2) - (x1 - x2) * (y4 - y3));
  return [ta, tb];
}
