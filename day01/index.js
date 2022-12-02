// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: null,
  asInteger: false,
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
  const setup = parseLinesIntoSetup(lines);
  return Math.max(...calculateTotalCaloriesByElf(setup));
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines);
  return getCaloriesOfTop3Elves(setup).reduce((acc, curr) => acc + curr, 0);
}

function parseLinesIntoSetup(lines) {
  /** @type {{ singleCaloriesByElves: Array<Array> }} */
  const setup = { singleCaloriesByElves: [] };

  let currElf = [];
  setup.singleCaloriesByElves.push(currElf);
  lines.forEach(text => {
    if (text === "") {
      currElf = [];
      setup.singleCaloriesByElves.push(currElf);
    } else {
      currElf.push(parseInt(text, 10));
    }
  });

  return setup;
}

function calculateTotalCaloriesByElf(setup) {
  return setup.singleCaloriesByElves.map(list => {
    let total = 0;
    list.forEach(calories => {
      total += calories;
    });
    return total;
  });
}

function getCaloriesOfTop3Elves(setup) {
  const totalCalories = calculateTotalCaloriesByElf(setup);
  const sorted = totalCalories.sort((a, b) => a - b);
  const top3 = sorted.slice(-3);
  return top3;
}

module.exports = {
  getSolutionPart1,
  getSolutionPart2,

  parseLinesIntoSetup,
  calculateTotalCaloriesByElf,
  getCaloriesOfTop3Elves,
};
