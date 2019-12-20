import * as fs from "fs";

const input: string[][] = fs
  .readFileSync("input", "utf8")
  .split("\n")
  .map(val => val.split(""));

const rowMid = input.length / 2;
const columnMid = input[0].length / 2;

interface Node {
  pos: string;
  level: number;
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

const neighbors: Map<
  string,
  Array<{ pos: string; change: number }>
> = new Map();
let origin: string = "";
let destination: string = "";

// For each set of gates, contains coordinates of the entrance first encountered gate
const gates: Map<string, string> = new Map();

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
        if (input[n[0]][n[1]] === ".") {
          locNeighbors.push({ pos: serPos(n), change: 0 });
        }
      }
      neighbors.set(serPos([row, column]), locNeighbors);
    }
  }
}

// Scanning rows, check all gate labels
for (let row = 0; row <= input.length - 2; row++) {
  for (let column = 0; column <= input[0].length - 2; column++) {
    const symbol = input[row][column];
    if (symbol.match(/[A-Z]/)) {
      const prevColumn = input[row]?.[column - 1];
      const nextColumn = input[row][column + 1];
      const nextNextColumn = input[row]?.[column + 2];
      const prevRow = input[row - 1]?.[column];
      const nextRow = input[row + 1][column];
      const nextNextRow = input[row + 2]?.[column];
      if (column > 0 && nextColumn.match(/[A-Z]/) && prevColumn === ".") {
        if (`${symbol}${nextColumn}` === "AA") {
          origin = serPos([row, column - 1]);
        }
        if (`${symbol}${nextColumn}` === "ZZ") {
          destination = serPos([row, column - 1]);
        }
        if (gates.has(`${symbol}${nextColumn}`)) {
          const neigh = gates.get(`${symbol}${nextColumn}`)!;
          const change = column < columnMid ? -1 : 1;
          neighbors
            .get(neigh)!
            .push({ pos: serPos([row, column - 1]), change });
          neighbors
            .get(serPos([row, column - 1]))!
            .push({ pos: neigh, change: -change });
        } else {
          gates.set(`${symbol}${nextColumn}`, serPos([row, column - 1]));
        }
      }
      if (
        column < input[0].length - 2 &&
        nextColumn.match(/[A-Z]/) &&
        nextNextColumn === "."
      ) {
        if (`${symbol}${nextColumn}` === "AA") {
          origin = serPos([row, column + 2]);
        }
        if (`${symbol}${nextColumn}` === "ZZ") {
          destination = serPos([row, column + 2]);
        }
        if (gates.has(`${symbol}${nextColumn}`)) {
          const neigh = gates.get(`${symbol}${nextColumn}`)!;
          const change = column < columnMid ? 1 : -1;
          neighbors
            .get(neigh)!
            .push({ pos: serPos([row, column + 2]), change });
          neighbors
            .get(serPos([row, column + 2]))!
            .push({ pos: neigh, change: -change });
        } else {
          gates.set(`${symbol}${nextColumn}`, serPos([row, column + 2]));
        }
      }
      if (row > 0 && nextRow.match(/[A-Z]/) && prevRow === ".") {
        if (`${symbol}${nextRow}` === "AA") {
          origin = serPos([row - 1, column]);
        }
        if (`${symbol}${nextRow}` === "ZZ") {
          destination = serPos([row - 1, column]);
        }
        if (gates.has(`${symbol}${nextRow}`)) {
          const neigh = gates.get(`${symbol}${nextRow}`)!;
          const change = row < rowMid ? -1 : 1;
          neighbors
            .get(neigh)!
            .push({ pos: serPos([row - 1, column]), change });
          neighbors
            .get(serPos([row - 1, column]))!
            .push({ pos: neigh, change: -change });
        } else {
          gates.set(`${symbol}${nextRow}`, serPos([row - 1, column]));
        }
      }
      if (
        row < input.length - 2 &&
        nextRow.match(/[A-Z]/) &&
        nextNextRow === "."
      ) {
        if (`${symbol}${nextRow}` === "AA") {
          origin = serPos([row + 2, column]);
        }
        if (`${symbol}${nextRow}` === "ZZ") {
          destination = serPos([row + 2, column]);
        }
        if (gates.has(`${symbol}${nextRow}`)) {
          const neigh = gates.get(`${symbol}${nextRow}`)!;
          const change = row < rowMid ? 1 : -1;
          neighbors
            .get(neigh)!
            .push({ pos: serPos([row + 2, column]), change });
          neighbors
            .get(serPos([row + 2, column]))!
            .push({ pos: neigh, change: -change });
        } else {
          gates.set(`${symbol}${nextRow}`, serPos([row + 2, column]));
        }
      }
    }
  }
}

const visited: Set<string> = new Set();
const bfsQueue: Queue<Node> = new Queue();

const start = { pos: origin, length: 0, level: 0 };
bfsQueue.enqueue(start);
visited.add(start.pos);

while (true) {
  const curr = bfsQueue.dequeue()!;
  const nextList = neighbors.get(curr.pos)!;
  for (const next of nextList) {
    if (next.pos === destination && curr.level + next.change === 0) {
      throw new Error(`${curr.length + 1}`);
    }
    const nextNode: Node = {
      pos: next.pos,
      length: curr.length + 1,
      level: curr.level + next.change
    };
    if (
      nextNode.level >= 0 &&
      !visited.has(nextNode.pos + "," + nextNode.level)
    ) {
      bfsQueue.enqueue(nextNode);
      visited.add(nextNode.pos + "," + nextNode.level);
    }
  }
}

function serPos(input: [number, number]): string {
  return `${input[0]},${input[1]}`;
}
