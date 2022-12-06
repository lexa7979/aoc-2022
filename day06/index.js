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
  return getFirstPositionAfterFourUniqueCharacters(setup);
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  return getFirstPositionAfterFourteenUniqueCharacters(setup);
}

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {{ text: string }} */
  const setup = { text: "" };

  lines.forEach(line => {
    if (line) {
      setup.text = line;
    }
  });

  return setup;
}

function getFirstPositionAfterFourUniqueCharacters(setup) {
  const results = [];

  const { text } = setup;
  for (let i = 3; i < setup.text.length; i++) {
    const lastFourLetters = [text[i - 3], text[i - 2], text[i - 1], text[i]];
    const isDifferentLetters = lastFourLetters.every((letter, index) => lastFourLetters.indexOf(letter) === index);
    if (isDifferentLetters) {
      return i + 1;
    }
  }

  return results;
}

function getFirstPositionAfterFourteenUniqueCharacters(setup) {
  const results = [];

  const letters = setup.text.split("");

  for (let i = 14; i <= setup.text.length; i++) {
    const currFourteenLetters = letters.slice(i - 14, i);
    const isDifferentLetters = currFourteenLetters.every(
      (letter, index) => currFourteenLetters.indexOf(letter) === index
    );
    if (isDifferentLetters) {
      return i;
    }
  }

  return results;
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
  getFirstPositionAfterFourUniqueCharacters,
  getFirstPositionAfterFourteenUniqueCharacters,
};
