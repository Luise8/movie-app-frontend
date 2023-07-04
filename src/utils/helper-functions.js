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
};
export default helperFunctions;
