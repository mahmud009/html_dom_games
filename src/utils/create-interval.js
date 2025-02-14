export function createInterval(timeout) {
  let elapsed = performance.now();
  return function interval(delta, callback) {
    elapsed += delta;
    if (elapsed / timeout >= 1) {
      callback();
      elapsed = 0;
    }
  };
}
