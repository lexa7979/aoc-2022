// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: null,
  asInteger: false,
  dontTrimInput: true,
});

const DIRECTIONS = Object.freeze({ NORTH: "north", SOUTH: "south", WEST: "west", EAST: "east" });
const { NORTH, SOUTH, WEST, EAST } = DIRECTIONS;

module.exports = {
  getSolutionPart1,
  getSolutionPart2,
  parseLinesIntoSetup,

  moveElves,
  countEmptyGround,
  // placeholder,
};

if (process.env.NODE_ENV !== "test") {
  console.log("Javascript");
  const part = process.env.part || "part1";
  if (part === "part1") {
    console.log(getSolutionPart1());
  } else {
    console.log(getSolutionPart2());
  }
}

function getSolutionPart1(handleLogEvent) {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, true);
  const { elves } = moveElves(setup, 10, handleLogEvent);
  return countEmptyGround(elves, setup.elvesCount);
}

function getSolutionPart2(handleLogEvent) {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const { roundCount } = moveElves(setup, Number.MAX_SAFE_INTEGER, handleLogEvent);
  return roundCount;
}

/**
 * @typedef SETUP
 * @property {COORDINATES_Y_X} elves
 * @property {number} elvesCount
 */

/** @typedef {{ x: number, y: number }} COORDINATE */
/** @typedef {{ [y: number]: number[] }} COORDINATES_Y_X */

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { elves: {}, elvesCount: 0 };

  lines.forEach((line, y) => {
    setup.elves[y] = [];
    for (let x = 0; x < line.length; x++) {
      if (line[x] === "#") {
        setup.elves[y].push(x);
        setup.elvesCount++;
      }
    }
  });

  return setup;
}

/** @param {SETUP} setup */
/** @param {number} maxRounds */
/** @param {Function | null} handleLogEvent */
function moveElves(setup, maxRounds = Number.MAX_SAFE_INTEGER, handleLogEvent) {
  const progress = new Helpers.Progress({ handleLogEvent });
  progress.init(setup.elvesCount > 1000 ? 20 * setup.elvesCount : 5 * setup.elvesCount);

  /** @type {COORDINATES_Y_X} */
  let currElves = _moveAllElves(setup.elves, []);

  const _isElf = (x, y) => {
    return currElves[y] && currElves[y].includes(x);
  };

  const _checkIfHasNeighbors = (x, y, dir) => {
    switch (dir) {
      case NORTH:
        return _isElf(x - 1, y - 1) || _isElf(x, y - 1) || _isElf(x + 1, y - 1);
      case SOUTH:
        return _isElf(x - 1, y + 1) || _isElf(x, y + 1) || _isElf(x + 1, y + 1);
      case WEST:
        return _isElf(x - 1, y - 1) || _isElf(x - 1, y) || _isElf(x - 1, y + 1);
      case EAST:
        return _isElf(x + 1, y - 1) || _isElf(x + 1, y) || _isElf(x + 1, y + 1);
    }
  };

  let round = 0;
  for (; round < maxRounds; round++) {
    const directionsToCheck = _getPossibleDirections(round);

    /** @type {Array<{ from: COORDINATE, to: COORDINATE }>} */
    const proposedMoves = [];
    Object.keys(currElves).forEach(key => {
      const y = parseInt(key, 10);
      currElves[key].forEach(x => {
        progress.step();

        const hasNeighborsByDirection = directionsToCheck.map(dir => _checkIfHasNeighbors(x, y, dir));
        const hasSomeNeighborsAround = hasNeighborsByDirection.some(Boolean);
        const hasOnlyNeighborsAround = hasNeighborsByDirection.every(Boolean);
        if (hasSomeNeighborsAround && !hasOnlyNeighborsAround) {
          const dirIndex = hasNeighborsByDirection.findIndex(flag => !flag);
          const dir = directionsToCheck[dirIndex];
          proposedMoves.push({
            from: { x, y },
            to: {
              [NORTH]: { x, y: y - 1 },
              [SOUTH]: { x, y: y + 1 },
              [WEST]: { x: x - 1, y },
              [EAST]: { x: x + 1, y },
            }[dir],
          });
        }
      });
    });

    if (proposedMoves.length === 0) {
      break;
    }

    /** @type {COORDINATES_Y_X} */
    const positionsWithCollision = {};
    proposedMoves.forEach(({ to }, index) => {
      const isDuplicate = proposedMoves.findIndex(item => item.to.x === to.x && item.to.y === to.y) !== index;
      if (isDuplicate) {
        positionsWithCollision[to.y] = positionsWithCollision[to.y] || [];
        if (!positionsWithCollision[to.y].includes(to.x)) {
          positionsWithCollision[to.y].push(to.x);
        }
      }
    });

    const moves = [];
    proposedMoves.forEach(({ from, to }) => {
      if (!positionsWithCollision[to.y] || !positionsWithCollision[to.y].includes(to.x)) {
        moves.push({ from, to });
      }
    });

    currElves = _moveAllElves(currElves, moves);
  }

  progress.finalize();
  return { elves: currElves, roundCount: round + 1 };
}

function _moveAllElves(currElves, moves = [{ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }]) {
  /** @type {COORDINATES_Y_X} */
  const result = {};

  const _add = ({ x, y }) => {
    if (!result[y]) {
      result[y] = [];
    }
    result[y].push(x);
    result[y].sort();
  };

  Object.keys(currElves).forEach(key => {
    const y = parseInt(key, 10);
    currElves[key].forEach(x => {
      const currMove = moves.find(item => item.from.x === x && item.from.y === y);
      _add(currMove?.to || { x, y });
    });
  });

  return result;
}

function _getPossibleDirections(round) {
  switch (round % 4) {
    case 0:
      return [NORTH, SOUTH, WEST, EAST];
    case 1:
      return [SOUTH, WEST, EAST, NORTH];
    case 2:
      return [WEST, EAST, NORTH, SOUTH];
    case 3:
      return [EAST, NORTH, SOUTH, WEST];
    default:
      throw new Error("Invalid round");
  }
}

/** @param {COORDINATES_Y_X} elves */
/** @param {number} elvesCount */
function countEmptyGround(elves, elvesCount) {
  const yValues = Object.keys(elves).map(key => parseInt(key, 10));

  const min = { x: Number.MAX_SAFE_INTEGER, y: Math.min(...yValues) };
  const max = { x: Number.MIN_SAFE_INTEGER, y: Math.max(...yValues) };

  Object.values(elves).forEach(xValues => {
    min.x = Math.min(min.x, ...xValues);
    max.x = Math.max(max.x, ...xValues);
  });

  const area = (max.x - min.x + 1) * (max.y - min.y + 1);
  return area - elvesCount;
}

/** @param {SETUP} setup */
/** @param {Function | null} handleLogEvent * /
function placeholder(setup, handleLogEvent) {
  const results = [];
  const progress = new Helpers.Progress({ handleLogEvent }).init(100);

  progress.finalize();
  return results;
}

/**/
