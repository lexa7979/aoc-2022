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
  runRearrangements(setup);
  const solution = setup.stacks
    .map(list => list.pop())
    .filter(Boolean)
    .join("");
  return solution;
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, true);
  runAlternativeRearrangements(setup);
  const solution = setup.stacks
    .map(list => list.pop())
    .filter(Boolean)
    .join("");
  return solution;
}

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {{ stacks: Array<Array>, rearrangements: Array<object> }} */
  const setup = { stacks: [[], [], [], [], [], [], [], [], [], []], rearrangements: [] };

  let isFirstPartOfFile = true;
  lines.forEach(line => {
    if (isFirstPartOfFile) {
      if (!line.trim()) {
        isFirstPartOfFile = false;
      } else {
        const reg = /\[(\w)\]/g;
        let match = reg.exec(line);
        while (match) {
          const index = match.index / 4;
          setup.stacks[index].unshift(match[1]);
          match = reg.exec(line);
        }
      }
    } else {
      const match = /^move (\d+) from (\d+) to (\d+)/.exec(line);
      if (match) {
        setup.rearrangements.push({
          move: parseInt(match[1], 10),
          from: parseInt(match[2], 10),
          to: parseInt(match[3], 10),
        });
      }
    }
  });

  return setup;
}

/**
function placeholder(setup) {
  const results = [];

  return results;
}
 **/

function runRearrangements(setup) {
  setup.rearrangements.forEach(({ move, from, to }) => {
    for (let i = 0; i < move; i++) {
      const crate = setup.stacks[from - 1].pop();
      setup.stacks[to - 1].push(crate);
    }
  });

  return setup;
}

function runAlternativeRearrangements(setup) {
  setup.rearrangements.forEach(({ move, from, to }) => {
    const crates = [];
    for (let i = 0; i < move; i++) {
      crates.unshift(setup.stacks[from - 1].pop());
    }
    setup.stacks[to - 1].push(...crates);
  });

  return setup;
}

module.exports = {
  getSolutionPart1,
  getSolutionPart2,

  parseLinesIntoSetup,
  runRearrangements,
  runAlternativeRearrangements,
};
