function getArrayLength(arr) {
  return arr.length;
}

function getArrayMetadata(arr) {
  return {
    length: getArrayLength(arr),
    firstObject: arr[0],
  };
}
module.exports = {
  getArrayMetadata,
};
