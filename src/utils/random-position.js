import { randomInRange } from "./random-in-range";

export function randomPosition(count, xBound, yBound) {
  let coords = [];
  for (let i = 0; i < count; i++) {
    coords.push({ x: randomInRange(0, xBound), y: randomInRange(0, yBound) });
  }
  return coords;
}
