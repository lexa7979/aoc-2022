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
  const rocks = mapIntoRocks(setup);
  const sand = simulateSand(rocks, true);

  // const painting = Helpers.paintCoordinates({ list: rocks, list2: sand, format: "list[-y] === [x1,x2,x3,...]" });
  // for (let i = 0; i < painting.length; i += 50) {
  //   console.log(painting.slice(i, i + 50));
  // }

  const result = countSand(sand);
  return result;
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const rocks = mapIntoRocks(setup);
  const sand = simulateSand(rocks, false);

  // const painting = Helpers.paintCoordinates({ list: rocks, list2: sand, format: "list[-y] === [x1,x2,x3,...]" });
  // for (let i = 0; i < painting.length; i += 50) {
  //   console.log(painting.slice(i, i + 50));
  // }

  const result = countSand(sand);
  return result;
}

/**
 * @typedef SETUP
 * @property {Array<Array>} rockPaths
 */

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { rockPaths: [] };

  lines.forEach(line => {
    if (line) {
      const regexp = /(\d+),(\d+)/g;
      let match = regexp.exec(line);
      const currPath = [];
      while (match) {
        currPath.push({ x: parseInt(match[1], 10) - 500, y: parseInt(match[2], 10) });
        match = regexp.exec(line);
      }
      if (currPath.length > 0) {
        setup.rockPaths.push(currPath);
      }
    }
  });

  return setup;
}

/** @param {SETUP} setup */
function mapIntoRocks(setup) {
  const rocks = {};

  const _add = (x, y) => {
    if (!rocks[y]) {
      rocks[y] = [];
    }
    if (!rocks[y].includes(x)) {
      rocks[y].push(x);
      rocks[y].sort((a, b) => a - b);
    }
  };

  setup.rockPaths.forEach(path => {
    for (let index = 1; index < path.length; index++) {
      const prev = path[index - 1];
      const curr = path[index];
      if (curr.x === prev.x) {
        for (let y = Math.min(curr.y, prev.y); y <= Math.max(curr.y, prev.y); y++) {
          _add(curr.x, y);
        }
      } else if (curr.y === prev.y) {
        for (let x = Math.min(curr.x, prev.x); x <= Math.max(curr.x, prev.x); x++) {
          _add(x, curr.y);
        }
      }
    }
  });

  return rocks;
}

function simulateSand(rocks, isPartOne) {
  const sand = {};

  const _hasRock = (x, y) => rocks[y] && rocks[y].includes(x);
  const _hasSand = (x, y) => sand[y] && sand[y].includes(x);
  const _isEmpty = (x, y) => !_hasRock(x, y) && !_hasSand(x, y);

  const _addSand = (x, y) => {
    if (!sand[y]) {
      sand[y] = [];
    }
    if (!sand[y].includes(x)) {
      sand[y].push(x);
      sand[y].sort((a, b) => a - b);
    }
  };

  const maxRockY = Math.max(...Object.keys(rocks).map(key => parseInt(key, 10)));

  while (true) {
    let currSand = { x: 0, y: 0 };
    while (true) {
      if (_isEmpty(currSand.x, currSand.y + 1)) {
        currSand.y++;
      } else if (_isEmpty(currSand.x - 1, currSand.y + 1)) {
        currSand.x--;
        currSand.y++;
      } else if (_isEmpty(currSand.x + 1, currSand.y + 1)) {
        currSand.x++;
        currSand.y++;
      } else {
        _addSand(currSand.x, currSand.y);
        break;
      }
      if (isPartOne && currSand.y > maxRockY) {
        break;
      }
      if (!isPartOne && currSand.y === maxRockY + 1) {
        _addSand(currSand.x, currSand.y);
        break;
      }
    }
    if (isPartOne && currSand.y > maxRockY) {
      break;
    }
    if (!isPartOne && currSand.y === 0) {
      break;
    }
  }

  return sand;
}

function countSand(sand) {
  return Object.values(sand)
    .map(list => list.length)
    .reduce((acc, curr) => acc + curr, 0);
}

/** @param {SETUP} setup */
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
  mapIntoRocks,
  simulateSand,
  countSand,
};
