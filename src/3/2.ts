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

const points: Coordinate[] = [];
for (const lineA of firstWireLines) {
  for (const lineB of secondWireLines) {
    if (intersect(lineA, lineB)) {
      const [ta, tb] = getIntersection(lineA, lineB);
      const point: Coordinate = {
        x: lineA.p1.x + ta * (lineA.p2.x - lineA.p1.x),
        y: lineA.p1.y + ta * (lineA.p2.y - lineA.p1.y)
      };
      points.push(point);
    }
  }
}

let minDist = Infinity;
for (const point of points) {
  const firstDist = wireDistanceTo(firstWireLines, point);
  const secondDist = wireDistanceTo(secondWireLines, point);
  minDist = Math.min(minDist, firstDist + secondDist);
}

console.log(minDist);

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

function wireDistanceTo(lines: Line[], p: Coordinate): number {
  let distance = 0;
  for (const l of lines) {
    const intersectX: boolean =
      (p.x >= l.p1.x && p.x <= l.p2.x) || (p.x <= l.p1.x && p.x >= l.p2.x);
    const intersectY: boolean =
      (p.y >= l.p1.y && p.y <= l.p2.y) || (p.y <= l.p1.y && p.y >= l.p2.y);
    if (intersectX && intersectY) {
      return distance + Math.abs(p.x - l.p1.x) + Math.abs(p.y - l.p1.y);
    }
    distance += Math.abs(l.p2.x - l.p1.x) + Math.abs(l.p2.y - l.p1.y);
  }
  return Infinity;
}

// function wireDistanceTo(lines: Line[], p: Coordinate): number {
//   let distance = 0;
//   for (const l of lines) {
//     const crossproduct =
//       (p.y - l.p1.y) * (l.p2.x - l.p1.x) - (p.x - l.p1.x) * (l.p2.y - l.p1.y);
//     const dotproduct =
//       (p.x - l.p1.x) * (l.p2.x - l.p1.x) - (p.y - l.p1.y) * (l.p2.y - l.p1.y);
//     const squaredLength = (l.p2.x - l.p1.x) ** 2 + (l.p2.y - l.p1.y) ** 2;
//     if (crossproduct < 0.0001 && dotproduct > 0 && dotproduct < squaredLength) {
//       return distance + Math.abs(p.x - l.p1.x) + Math.abs(p.y - l.p1.y);
//     }
//     distance += Math.abs(p.x - l.p1.x) + Math.abs(p.y - l.p1.y);
//   }
//   return Infinity;
// }
