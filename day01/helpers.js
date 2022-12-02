const fs = require("fs");

const Global = {
  parseOptions: { transformMatch: null, asInteger: false },
};

function setParseOptions({ transformMatch, asInteger }) {
  Global.parseOptions = { transformMatch, asInteger };
}

/**
 * @param {string[] | null} lines
 *
 * @returns
 */
function parseInputData(lines = null) {
  /** @type {{ transformMatch?: object, asInteger: boolean | number[]}} */
  const { transformMatch, asInteger } = Global.parseOptions;
  const _lines = lines || _getInputFile();
  if (transformMatch instanceof RegExp) {
    const matchedLines = _lines.map(text => transformMatch.exec(text));
    if (matchedLines.some(match => !match)) {
      throw new Error(`Failed to parse line "${_lines[matchedLines.findIndex(match => !match)]}"`);
    }
    if (Array.isArray(asInteger)) {
      return matchedLines.map(match =>
        match?.slice(1).map((text, index) => (asInteger.includes(index + 1) ? parseInt(text, 10) : text))
      );
    }
    return asInteger
      ? matchedLines.map(match => match?.slice(1).map(text => parseInt(text, 10)))
      : matchedLines.map(match => match?.slice(1));
  }
  return asInteger ? _lines.map(text => parseInt(text, 10)) : _lines;
}

/**
 * @returns {string[]}
 */
function _getInputFile() {
  return fs.readFileSync("input.txt").toString().trim().split("\n");
}

/**
 * @param {number} first e.g. 7 or 20
 * @param {number} last  e.g. 9 or 17
 *
 * @returns {number[]} [7, 8, 9] or [20, 18, 17, 16]
 */
function getArrayRange(first, last) {
  if (first <= last) {
    return Array(last - first + 1)
      .fill(0)
      .map((_, index) => first + index);
  }
  return Array(first - last + 1)
    .fill(0)
    .map((_, index) => first - index);
}

/**
 * @param {number} n
 * @param {Array} elements
 *
 * @returns {Array | null}
 */
function getNthPermutationOfElements(n, elements) {
  if (elements.length === 0) {
    return [];
  }

  const numberOfElements = elements.length;

  let factorial = 1;
  elements.forEach((_, index) => {
    factorial *= index + 1;
  });
  const numberOfPermutations = factorial;

  if (n >= numberOfPermutations) {
    return null;
  }

  const indexOfFirstElement = Math.floor(n / (numberOfPermutations / numberOfElements));
  const otherElements = elements.filter((key, index) => index !== indexOfFirstElement);

  const permutationOfOtherElements = getNthPermutationOfElements(
    n % (numberOfPermutations / numberOfElements),
    otherElements
  );

  return [elements[indexOfFirstElement], ...permutationOfOtherElements];
}

module.exports = {
  setParseOptions,
  parseInputData,
  getArrayRange,
  getNthPermutationOfElements,
};
