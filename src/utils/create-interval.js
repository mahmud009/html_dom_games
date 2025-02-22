export function createInterval(timeout) {
  let elapsed = 0;
  return function interval(delta, callback) {
    elapsed += delta;
    if (elapsed / timeout >= 1) {
      callback();
      elapsed = 0;
    }
  };
}
