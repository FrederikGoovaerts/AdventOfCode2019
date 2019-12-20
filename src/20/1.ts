import * as fs from "fs";

const input: string[][] = fs
  .readFileSync("in4", "utf8")
  .trim()
  .split("\n")
  .map(val => val.split(""));

interface Node {
  pos: string;
  length: number;
}

class Queue<T> {
  private a: T[] = [];
  private b = 0;
  getLength() {
    return this.a.length - this.b;
  }
  isEmpty() {
    return 0 == this.a.length;
  }
  enqueue(b: T) {
    this.a.push(b);
  }
  dequeue() {
    if (0 != this.a.length) {
      var c = this.a[this.b];
      2 * ++this.b >= this.a.length &&
        ((this.a = this.a.slice(this.b)), (this.b = 0));
      return c;
    }
  }
  peek() {
    return 0 < this.a.length ? this.a[this.b] : void 0;
  }
}

const neighbors: Map<string, string[]> = new Map();
let origin: [number, number] = [-1, -1];

// For each set of gates, contains coordinates of the first encountered gate
const gates: Map<
  string,
  { coords: [[number, number], [number, number]]; dir: "v" | "h" }
> = new Map();

// Scanning rows, check all regular neighbors and horizontal gate labels
for (let row = 1; row < input.length - 1; row++) {
  for (let column = 1; column < input[0].length - 1; column++) {
    const symbol = input[row][column];
    if (symbol === "#" || symbol === " ") {
      continue;
    } else if (symbol === ".") {
      const possibleNeighbors: [number, number][] = [
        [row + 1, column],
        [row - 1, column],
        [row, column + 1],
        [row, column - 1]
      ];
      const locNeighbors = [];
      for (const n of possibleNeighbors) {
        if (input[n[0]][n[1]] !== "#") {
          locNeighbors.push(serPos(n));
        }
      }
      neighbors.set(serPos([row, column]), locNeighbors);
    } else if (symbol.match(/[A-Z]/)) {
      // if first gate of these symbols, save in gates map
      // else add neighbors
    }
  }
}

const visited: Set<string> = new Set();

const bfsQueue: Queue<Node> = new Queue();
const start = { pos: serPos(origin), length: 0 };
bfsQueue.enqueue(start);
visited.add(start.pos);

// while (true) {
//   const curr = bfsQueue.dequeue()!;
//   const nextList = neighbors.get(curr.pos)!;
//   for (const next of nextList) {
//     if (
//       doorLoc.has(next) &&
//       !curr.keys.includes(doorLoc.get(next)!.toLowerCase())
//     ) {
//       continue;
//     }
//     let nextNode: Node;
//     if (
//       keyLocations.has(next) &&
//       !curr.keys.includes(keyLocations.get(next)!)
//     ) {
//       const newKeys = [...curr.keys, keyLocations.get(next)!].sort().join("");
//       if (newKeys.length === keyLocations.size) {
//         throw new Error(`${curr.length + 1}`);
//       }
//       nextNode = { pos: next, length: curr.length + 1, keys: newKeys };
//     } else {
//       nextNode = {
//         pos: next,
//         length: curr.length + 1,
//         keys: curr.keys
//       };
//     }
//     if (!visited.has(serNode(nextNode))) {
//       bfsQueue.enqueue(nextNode);
//       visited.add(serNode(nextNode));
//     }
//   }
// }

function serPos(input: [number, number]): string {
  return `${input[0]},${input[1]}`;
}
