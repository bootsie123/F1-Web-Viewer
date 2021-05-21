const deepClone = obj => {
  let clone = obj;

  if (typeof obj === "object") {
    if (obj === null) {
      clone = null;
    } else if (Array.isArray(obj)) {
      clone = obj.map(deepClone);
    } else {
      clone = Object.keys(obj).reduce((prev, key) => {
        prev[key] = deepClone(obj[key]);

        return prev;
      }, {});
    }
  }

  return clone;
};

module.exports = deepClone;
