const testHelperFunctions = {
  colorConversion: {
    arrayToRGBString(rgb) { return `rgb(${rgb.join(', ')})`; },
    hexToRGBArray(hex) { return hex.match(/[A-Za-z0-9]{2}/g).map((v) => parseInt(v, 16)); },
    rgbArrayToHex(rgb) { return `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`; },
    rgbStringToArray(rgb) { return rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).splice(1, 3).map((v) => Number(v)); },
    rgbStringToHex(rgb) {
      const arrayRgb = this.rgbStringToArray(rgb);
      return this.rgbArrayToHex(arrayRgb);
    },
    hexStringToRgb(hex) {
      const arrayRgb = this.hexToRGBArray(hex);
      return this.arrayToRGBString(arrayRgb);
    },
  },
};
export default testHelperFunctions;
