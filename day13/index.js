// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: null,
  asInteger: false,
  dontTrimInput: true,
});

if (process.env.NODE_ENV !== "test") {
  console.log("Javascript");
  const part = process.env.part || "part1";
  if (part === "part1") {
    console.log(getSolutionPart1());
  } else {
    console.log(getSolutionPart2());
  }
}

function getSolutionPart1() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, true);
  const result = decideIfItemsAreInCorrectOrder(setup);
  const sum = result.reduce((acc, curr, index) => (curr ? acc + index + 1 : acc), 0);
  return sum;
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const result = sortCompletePacketListIncludingDividers(setup);
  const index1 = result.findIndex(item => item === "[[2]]") + 1;
  const index2 = result.findIndex(item => item === "[[6]]") + 1;
  return index1 * index2;
}

/**
 * @typedef SETUP
 * @property {Array<object>} pairs
 */

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { pairs: [] };

  const currPair = [];
  lines.forEach(line => {
    if (line) {
      currPair.push(line);
    } else {
      if (currPair.length === 2) {
        setup.pairs.push(currPair.splice(0));
      } else {
        throw new Error("Unexpected length of currPair");
      }
    }
  });

  if (currPair.length === 2) {
    setup.pairs.push(currPair.splice(0));
  } else {
    throw new Error("Unexpected length of currPair");
  }

  return setup;
}

function comparePackets(leftItems, rightItems) {
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftItems[leftIndex] && rightItems[rightIndex]) {
    const left = leftItems[leftIndex];
    const right = rightItems[rightIndex];

    // console.log({ left, leftIndex, right, rightIndex });

    if (left.level === right.level) {
      if (left.value !== right.value) {
        if (left.value === "EOL" || right.value === "EOL") {
          return left.value === "EOL";
        }
        return left.value < right.value;
      }
    } else if (left.level < right.level) {
      const level = left.level + 1;
      if (left.value === "EOL") {
        return true;
      } else {
        leftItems.splice(leftIndex, 1, { level, value: left.value }, { level, value: "EOL" });
      }
      continue;
    } else if (right.level < left.level) {
      const level = right.level + 1;
      if (right.value === "EOL") {
        return false;
      } else {
        rightItems.splice(rightIndex, 1, { level, value: right.value }, { level, value: "EOL" });
      }
      continue;
    }

    leftIndex++;
    rightIndex++;
  }

  return !leftItems[leftIndex];
}

/**
 * @param {SETUP} setup
 */
function decideIfItemsAreInCorrectOrder(setup) {
  const results = [];

  setup.pairs.forEach(pair => {
    const leftItems = parseList(pair[0]);
    const rightItems = parseList(pair[1]);
    results.push(comparePackets(leftItems, rightItems));
  });

  return results;
}

function parseList(list) {
  const results = [];

  const regexp = /[\[\]]|\d+/g;

  let currBracketsLevel = 0;
  let match = regexp.exec(list);
  while (match) {
    if (match[0] === "[") {
      currBracketsLevel++;
    } else if (match[0] === "]") {
      results.push({ level: currBracketsLevel, value: "EOL" });
      currBracketsLevel--;
    } else {
      results.push({ level: currBracketsLevel, value: parseInt(match[0], 10) });
    }
    match = regexp.exec(list);
  }

  return results;
}

/**
 * @param {SETUP} setup
 *
 * @returns
 */
function sortCompletePacketListIncludingDividers(setup) {
  const allPackets = ["[[2]]", "[[6]]"];
  setup.pairs.forEach(([left, right]) => allPackets.push(left, right));

  allPackets.sort((a, b) => (comparePackets(parseList(a), parseList(b)) ? -1 : 1));

  return allPackets;
}

/**
function placeholder(setup) {
  const results = [];

  return results;
}

**/

module.exports = {
  getSolutionPart1,
  getSolutionPart2,

  parseLinesIntoSetup,
  decideIfItemsAreInCorrectOrder,
  parseList,
  sortCompletePacketListIncludingDividers,
};
