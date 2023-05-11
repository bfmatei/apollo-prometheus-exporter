'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.convertMsToS = exports.filterLabels = void 0;
function filterLabels(labels) {
  return Object.fromEntries(Object.entries(labels).filter(([_label, value]) => value !== undefined && value !== null));
}
exports.filterLabels = filterLabels;
function convertMsToS(ms) {
  return ms / 1000;
}
exports.convertMsToS = convertMsToS;
