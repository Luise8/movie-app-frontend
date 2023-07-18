const helperFunctions = {
  getUniqueItemsByProperties(arr, prop) {
    return arr.filter((item, index, array) => index === array.findIndex((current) => (
      current[prop] === item[prop]
    )));
  },
  isObjectEmpty(objectName) {
    return (
      objectName
      && Object.keys(objectName).length === 0
      && objectName.constructor === Object
    );
  },

  group(inputArray, size) {
    const result = [];
    for (let i = 0; i < inputArray.length; i += size) {
      result.push([]);
      for (let j = i; j < i + size && j < inputArray.length; j += 1) {
        result[i / size].push(inputArray[j]); // Adds i
      }
    }
    return result;
  },

};
export default helperFunctions;
