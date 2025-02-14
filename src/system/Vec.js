export class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  multiplyScalar(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
  multiply(vec) {
    return new Vec(this.x * vec.x, this.y * vec.y);
  }
}
