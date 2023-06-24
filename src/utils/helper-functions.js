const helperFunctions = {
  getUniqueItemsByProperties(arr, prop) {
    return arr.filter((item, index, array) => index === array.findIndex((current) => (
      current[prop] === item[prop]
    )));
  },
};
export default helperFunctions;
