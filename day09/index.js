// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: /([RULD]) (\d+)/,
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
  const positions = simulateMovementsOfTail(setup);
  const uniquePositions = positions.filter((item, index) => positions.indexOf(item) === index);
  return uniquePositions.length;
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const positions = simulateMovementsOfTenKnots(setup);
  const uniquePositions = positions.filter((item, index) => positions.indexOf(item) === index);
  return uniquePositions.length;
}

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {{ movements: Array<object> }} */
  const setup = { movements: [] };

  lines.forEach(line => {
    if (line) {
      const direction = { L: "left", R: "right", U: "up", D: "down" }[line[0]];
      setup.movements.push({ direction, steps: line[1] });
    }
  });

  return setup;
}

function simulateMovementsOfTail(setup) {
  const results = [];

  let currHeadX = 0;
  let currHeadY = 0;
  let currTailX = 0;
  let currTailY = 0;

  const _moveHead = direction => {
    currHeadX += { left: -1, right: 1 }[direction] || 0;
    currHeadY += { up: 1, down: -1 }[direction] || 0;
  };

  const _updateTail = () => {
    const diffX = currHeadX - currTailX;
    const diffY = currHeadY - currTailY;
    if (Math.abs(diffX) > 1 || Math.abs(diffY) > 1) {
      if (diffX === 0) {
        currTailY = diffY > 0 ? currHeadY - 1 : currHeadY + 1;
      } else if (diffY === 0) {
        currTailX = diffX > 0 ? currHeadX - 1 : currHeadX + 1;
      } else {
        currTailX += diffX < 0 ? -1 : 1;
        currTailY += diffY < 0 ? -1 : 1;
      }
    }
  };

  setup.movements.forEach(({ direction, steps }) => {
    for (let i = 0; i < steps; i++) {
      _moveHead(direction);
      _updateTail();
      const tailPos = `${currTailX};${currTailY}`;
      results.push(tailPos);
    }
  });

  return results;
}

function simulateMovementsOfTenKnots(setup) {
  const results = [];

  const knotX = Array(10).fill(0);
  const knotY = Array(10).fill(0);

  const _moveHead = direction => {
    knotX[0] += { left: -1, right: 1 }[direction] || 0;
    knotY[0] += { up: 1, down: -1 }[direction] || 0;
  };

  const _updateKnot = index => {
    const diffX = knotX[index - 1] - knotX[index];
    const diffY = knotY[index - 1] - knotY[index];
    if (Math.abs(diffX) > 1 || Math.abs(diffY) > 1) {
      if (diffX === 0) {
        knotY[index] = diffY > 0 ? knotY[index - 1] - 1 : knotY[index - 1] + 1;
      } else if (diffY === 0) {
        knotX[index] = diffX > 0 ? knotX[index - 1] - 1 : knotX[index - 1] + 1;
      } else {
        knotX[index] += diffX < 0 ? -1 : 1;
        knotY[index] += diffY < 0 ? -1 : 1;
      }
    }
  };

  setup.movements.forEach(({ direction, steps }) => {
    for (let i = 0; i < steps; i++) {
      _moveHead(direction);
      for (let index = 1; index < 10; index++) {
        _updateKnot(index);
      }
      const tailPos = `${knotX[9]};${knotY[9]}`;
      results.push(tailPos);
    }
  });

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
  simulateMovementsOfTail,
  simulateMovementsOfTenKnots,
};
