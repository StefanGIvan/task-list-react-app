export function Logger(prefix = "", enabled = true) {
  function log(...args) {
    if (!enabled) {
      return;
    }

    if (prefix) {
      console.log(prefix, ...args);
    } else {
      console.log(...args);
    }
  }

  function error(...args) {
    if (!enabled) {
      return;
    }

    if (prefix) {
      console.error(prefix, ...args);
    } else {
      console.error(...args);
    }
  }
  return { log: log, error: error };
}
