import { randomInRange } from "./random-in-range";

export function randomColor() {
  let chars = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += chars[randomInRange(chars.length - 1)];
  }
  return color;
}
