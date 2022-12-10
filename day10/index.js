// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: /(\w+)( -?\d+)?/,
  asInteger: [2],
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
  const states = runProgram(setup);
  const signals = listInterestingSignalsStrengths(states);
  return signals.reduce((acc, curr) => acc + curr, 0);
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const states = runProgram(setup);
  return getScreen(states);
}

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {{ commands: Array<object> }} */
  const setup = { commands: [] };

  lines.forEach(([command, value]) => {
    setup.commands.push({ command, value });
  });

  return setup;
}

function runProgram(setup) {
  const states = [];

  let registerX = 1;
  setup.commands.forEach(({ command, value }) => {
    states.push(registerX);
    if (command === "addx") {
      states.push(registerX);
      registerX += value;
    }
  });

  return states;
}

function listInterestingSignalsStrengths(states) {
  const results = [];

  [20, 60, 100, 140, 180, 220].forEach(cycle => {
    results.push(cycle * states[cycle - 1]);
  });

  return results;
}

function getScreen(states) {
  const results = [];

  for (let pixelPos = 0; pixelPos < 240; pixelPos++) {
    const posX = pixelPos % 40;
    const spritePos = states[pixelPos];
    results.push(Math.abs(posX - spritePos) < 2 ? "#" : ".");
  }

  const screenLines = [];
  for (let i = 0; i < results.length; i += 40) {
    screenLines.push(results.slice(i, i + 40).join(""));
  }

  return screenLines;
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
  runProgram,
  listInterestingSignalsStrengths,
  getScreen,
};
