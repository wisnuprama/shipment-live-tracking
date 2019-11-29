export function snakeToCamel(string) {
  return string.replace(/(_\w)/g, function(m) {
    return m[1].toUpperCase();
  });
}

export function camelToSnake(string) {
  return string
    .replace(/[\w]([A-Z])/g, function(m) {
      return m[0] + "_" + m[1];
    })
    .toLowerCase();
}

export function transformData(data, fn) {
  const keys = Object.keys(data);
  const newData = {};

  keys.forEach(k => {
    let value = data[k];
    if (typeof k === "object") {
      value = transformRequestData(k);
    }
    newData[fn(k)] = value;
  });

  return newData;
}

export function transformRequestData(data) {
  return transformData(data, camelToSnake);
}

export function transformResponseData(data) {
  return transformData(data, snakeToCamel);
}
