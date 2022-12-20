// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: null,
  asInteger: true,
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
  const numbers = remixNumbers(setup, true);
  const coordinates = getGroveCoordinates(numbers);
  return coordinates.reduce((acc, curr) => acc + curr, 0);
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const numbers = remixNumbers(setup, false);
  const coordinates = getGroveCoordinates(numbers);
  return coordinates.reduce((acc, curr) => acc + curr, 0);
}

/**
 * @typedef SETUP
 * @property {Array<number>} numbers
 */

const DECRYPTION_KEY = 811589153;

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { numbers: [] };

  lines.forEach(line => {
    if (line != null) {
      setup.numbers.push(line);
    }
  });

  return setup;
}

/** @param {SETUP} setup */
function remixNumbers(setup, isPartOne) {
  const numbersWithOriginalPosition = setup.numbers.map((n, pos) => ({ n: isPartOne ? n : n * DECRYPTION_KEY, pos }));

  const runCount = isPartOne ? 1 : 10;
  for (let run = 0; run < runCount; run++) {
    for (let currPos = 0; currPos < setup.numbers.length; currPos++) {
      const currIndex = numbersWithOriginalPosition.findIndex(item => item.pos === currPos);
      const currValue = numbersWithOriginalPosition[currIndex].n;
      const newIndex = (currIndex + currValue) % (setup.numbers.length - 1);

      if (currValue !== 0 && newIndex !== currIndex) {
        const movedItem = numbersWithOriginalPosition.splice(currIndex, 1)[0];
        numbersWithOriginalPosition.splice(newIndex, 0, movedItem);
      }
    }
  }

  return numbersWithOriginalPosition.map(item => item.n);
}

function getGroveCoordinates(numbers) {
  const startIndex = numbers.findIndex(n => n === 0);
  return [1000, 2000, 3000].map(index => numbers[(startIndex + index) % numbers.length]);
}

/** @param {SETUP} setup * /
function placeholder(setup) {
  const results = [];

  return results;
}

/**/

module.exports = {
  getSolutionPart1,
  getSolutionPart2,

  parseLinesIntoSetup,
  remixNumbers,
  getGroveCoordinates,
};
