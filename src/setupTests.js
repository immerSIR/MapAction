import '@testing-library/jest-dom'; 
global.ResizeObserver = require('resize-observer-polyfill');
import L from 'leaflet';
global.L = L;
if (typeof SVGElement !== "undefined" && !SVGElement.prototype.getScreenCTM) {
  SVGElement.prototype.getScreenCTM = function () {
    return {
      inverse() {
        return {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: 0,
          f: 0,
        };
      },
    };
  };
}

// Polyfill pour SVGSVGElement.createSVGMatrix
if (typeof SVGSVGElement !== "undefined" && !SVGSVGElement.prototype.createSVGMatrix) {
  SVGSVGElement.prototype.createSVGMatrix = function () {
    return {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: 0,
      f: 0,
      multiply(matrix) {
        return matrix;
      },
      inverse() {
        return this;
      },
    };
  };
}

