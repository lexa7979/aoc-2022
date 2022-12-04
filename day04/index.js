// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: /(\d+)-(\d+),(\d+)-(\d+)/,
  asInteger: true,
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
  const decisions = decideIfOneAssignmentFullyContainsTheOther(setup);
  const amount = decisions.filter(Boolean).length;
  return amount;
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const decisions = decideIfOneAssignmentPartlyContainsTheOther(setup);
  const amount = decisions.filter(Boolean).length;
  return amount;
}

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {{ assignmentPairs: Array<Array> }} */
  const setup = { assignmentPairs: [] };
  lines.forEach(line => {
    if (line) {
      setup.assignmentPairs.push([Helpers.getArrayRange(line[0], line[1]), Helpers.getArrayRange(line[2], line[3])]);
    }
  });
  return setup;
}

function decideIfOneAssignmentFullyContainsTheOther(setup) {
  const results = [];

  setup.assignmentPairs.forEach(([firstSections, secondSections]) => {
    results.push(
      firstSections.every(n => secondSections.includes(n)) || secondSections.every(n => firstSections.includes(n))
    );
  });

  return results;
}

function decideIfOneAssignmentPartlyContainsTheOther(setup) {
  const results = [];

  setup.assignmentPairs.forEach(([firstSections, secondSections]) => {
    results.push(firstSections.some(n => secondSections.includes(n)));
  });

  return results;
}

module.exports = {
  getSolutionPart1,
  getSolutionPart2,

  parseLinesIntoSetup,
  decideIfOneAssignmentFullyContainsTheOther,
  decideIfOneAssignmentPartlyContainsTheOther,
};
