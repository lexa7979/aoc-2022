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
  const isTreeVisible = mapIntoVisibleTrees(setup);
  let numberOfVisibleTrees = 0;
  isTreeVisible.forEach(row =>
    row.forEach(isVisible => {
      if (isVisible) {
        numberOfVisibleTrees++;
      }
    })
  );
  return numberOfVisibleTrees;
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const scores = mapIntoScenicScore(setup);
  return Math.max(...scores.map(row => Math.max(...row)));
}

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {{ rows: Array<Array> }} */
  const setup = { rows: [] };

  lines.forEach(line => line && setup.rows.push(line.split("")));

  return setup;
}

function mapIntoVisibleTrees(setup) {
  const results = [];

  setup.rows.forEach((row, colIndex) => {
    const currResultRow = row.map((currTree, rowIndex) => {
      const treesInLine = _getTreesInLine({ setup, rowIndex, colIndex, reverse: false });
      const isVisible = treesInLine.some(line => line.length === 0 || line.every(tree => tree < currTree));
      return isVisible;
    });
    results.push(currResultRow);
  });

  return results;
}

function mapIntoScenicScore(setup) {
  const results = [];

  setup.rows.forEach((row, colIndex) => {
    const currResultRow = row.map((currTree, rowIndex) => {
      const treesInLine = _getTreesInLine({ setup, rowIndex, colIndex, reverse: true });
      let score = 1;
      treesInLine.forEach(line => {
        const numberOfVisibleTreesInLine = line.findIndex(tree => tree >= currTree) + 1 || line.length;
        score *= numberOfVisibleTreesInLine || 1;
      });
      return score;
    });
    results.push(currResultRow);
  });

  return results;
}

function _getTreesInLine({ setup, rowIndex, colIndex, reverse }) {
  const left = setup.rows[colIndex].slice(0, rowIndex);
  const right = setup.rows[colIndex].slice(rowIndex + 1);
  const up = setup.rows.slice(0, colIndex).map(row => row[rowIndex]);
  const down = setup.rows.slice(colIndex + 1).map(row => row[rowIndex]);
  return reverse ? [left.reverse(), right, up.reverse(), down] : [left, right, up, down];
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
  mapIntoVisibleTrees,
  mapIntoScenicScore,
};
