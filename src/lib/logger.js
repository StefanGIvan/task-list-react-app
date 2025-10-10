export default function Logger(prefix = "", enabled = true) {
  //main log function
  function log(...args) {
    if (!enabled) {
      return;
    }

    if (prefix) {
      console.log(prefix, ...args);
    } else {
      console.log(...args);
    }

    //error method
    log.error = (...args) => {
      if (enabled) {
        console.error(prefix, ...args);
      }
    };
  }
  return log;
}
