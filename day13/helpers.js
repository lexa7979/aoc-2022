const fs = require('fs');

const Global = {
  parseOptions: { transformMatch: null, asInteger: false, dontTrimInput: false }
};

module.exports = {
  setParseOptions,
  parseInputData,
  getArrayRange,
  getNthPermutationOfElements,
  paintCoordinates
};

/**
 * @param {object} inputBag
 * @param {RegExp | null} inputBag.transformMatch
 *    e.g. /([RUDL]) (\d+)/
 * @param {boolean | number[]} inputBag.asInteger
 *    e.g. [2] or false
 * @param {boolean | null} [inputBag.dontTrimInput]
 */
function setParseOptions({ transformMatch, asInteger, dontTrimInput = false }) {
  // @ts-ignore
  Global.parseOptions = { transformMatch, asInteger, dontTrimInput };
}

/**
 * @param {string[] | null} lines
 *
 * @returns {Array}
 */
function parseInputData(lines = null) {
  /** @type {{ transformMatch?: object, asInteger: boolean | number[] }} */
  const { transformMatch, asInteger } = Global.parseOptions;
  let _lines = lines || _getInputFile();
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
  const { dontTrimInput } = Global.parseOptions;
  const content = fs.readFileSync('input.txt').toString();
  return dontTrimInput ? content.split('\n') : content.trim().split('\n');
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
 * Calculates one permutation without repetition.
 *
 * You might want to use this function in a loop to get all permutations.
 *
 * @param {number} n
 *    e.g. 10
 * @param {Array} elements
 *  List of unique elements (e.g. [3, 5, 7, 9, "hello"])
 *
 * @returns {Array | null}
 *  n-th permutation (e.g. [3, "hello", 9, 5, 7]); or
 *  null if there are less than n permutations
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

  return permutationOfOtherElements ? [elements[indexOfFirstElement], ...permutationOfOtherElements] : null;
}

/**
 * @param {object} inputBag
 * @param {Array} inputBag.list
 *    e.g. ["0;0", "1;1", "-1;2"]
 * @param {string} [inputBag.format]
 *
 * @returns {string[]}
 *    e.g. "#..."
 *         "..#."
 *         ".S.."
 */
function paintCoordinates({ list, format = '"x;y"' }) {
  let coordinates;
  switch (format) {
    case '"x;y"':
      coordinates = list.map(text => {
        const parsedText = text.split(';').map(part => parseInt(part, 10));
        return { x: parsedText[0], y: parsedText[1] };
      });
      break;

    case '{x,y}':
      const _isWrongFormat = item => !item || typeof item !== 'object' || item.x == null || item.y == null;
      if (list.some(_isWrongFormat)) {
        throw new Error(`List-item has wrong format (${JSON.stringify(list.find(_isWrongFormat))})`);
      }
      coordinates = list;
      break;

    default:
      throw new Error(`Unsupported format (${format})`);
  }

  const minX = Math.min(0, ...coordinates.map(pos => pos.x));
  const maxX = Math.max(0, ...coordinates.map(pos => pos.x));
  const minY = Math.min(0, ...coordinates.map(pos => pos.y));
  const maxY = Math.max(0, ...coordinates.map(pos => pos.y));

  const paintedMap = [];

  for (let posY = maxY; posY >= minY; posY--) {
    let currLine = '';
    for (let posX = minX; posX <= maxX; posX++) {
      if (coordinates.some(pos => pos.x === posX && pos.y === posY)) {
        currLine += posX === 0 && posY === 0 ? 'S' : '#';
      } else if (posX === 0 && posY === 0) {
        currLine += 's';
      } else {
        currLine += '.';
      }
    }
    paintedMap.push(currLine);
  }

  return paintedMap;
}
