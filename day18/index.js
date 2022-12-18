// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: /(\d+),(\d+),(\d+)/,
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
  return countExposedCubeSides(setup);
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const outsideCubes = fillBigCubeAroundLavaDropletWithoutRecursion(setup);
  return countCubeSidesExposedToOutsideCubes(setup, outsideCubes);
}

/**
 * @typedef SETUP
 * @property {Array<POSITION_3D>} cubes
 */

/**
 * @typedef POSITION_3D
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { cubes: [] };

  lines.forEach(line => {
    if (line) {
      if (line.length !== 3 || line.some(item => typeof item !== "number")) {
        throw new Error("Error parsing lines");
      }
      setup.cubes.push({ x: line[0], y: line[1], z: line[2] });
    }
  });

  return setup;
}

/** @param {SETUP} setup */
function countExposedCubeSides(setup) {
  let result = 0;

  setup.cubes.forEach(item => {
    listAdjacentPositions(item).forEach(pos => {
      if (!hasCube(setup.cubes, pos)) {
        result++;
      }
    });
  });

  return result;
}

/** @param {SETUP} setup */
function countCubeSidesExposedToOutsideCubes(setup, outsideCubes) {
  let result = 0;

  setup.cubes.forEach(item => {
    listAdjacentPositions(item).forEach(pos => {
      if (!hasCube(setup.cubes, pos) && hasCube(outsideCubes, pos)) {
        result++;
      }
    });
  });

  return result;
}

/** @param {SETUP} setup */
function fillBigCubeAroundLavaDropletWithoutRecursion(setup) {
  /** @type {Array<POSITION_3D>} */
  const outsideCubes = [];

  const minX = Math.min(...setup.cubes.map(pos => pos.x)) - 1;
  const maxX = Math.max(...setup.cubes.map(pos => pos.x)) + 1;
  const minY = Math.min(...setup.cubes.map(pos => pos.y)) - 1;
  const maxY = Math.max(...setup.cubes.map(pos => pos.y)) + 1;
  const minZ = Math.min(...setup.cubes.map(pos => pos.z)) - 1;
  const maxZ = Math.max(...setup.cubes.map(pos => pos.z)) + 1;

  const startCube = { x: minX, y: minY, z: minZ };

  let currentPositions = [startCube];

  while (currentPositions.length > 0) {
    currentPositions = currentPositions.filter(
      pos =>
        !hasCube(setup.cubes, pos) &&
        !hasCube(outsideCubes, pos) &&
        pos.x >= minX &&
        pos.x <= maxX &&
        pos.y >= minY &&
        pos.y <= maxY &&
        pos.z >= minZ &&
        pos.z <= maxZ
    );
    currentPositions.forEach(pos => outsideCubes.push(pos));

    const newPositions = [];
    currentPositions.forEach(currPos => {
      listAdjacentPositions(currPos).forEach(newPos => {
        if (!hasCube(newPositions, newPos)) {
          newPositions.push(newPos);
        }
      });
    });

    currentPositions = newPositions;
  }

  return outsideCubes;
}

/** @param {Array<POSITION_3D>} list */
/** @param {POSITION_3D} pos */
function hasCube(list, pos) {
  return list.some(item => item.x === pos.x && item.y === pos.y && item.z === pos.z);
}

/** @param {POSITION_3D} pos */
function listAdjacentPositions(pos) {
  return [
    { x: pos.x, y: pos.y, z: pos.z - 1 },
    { x: pos.x, y: pos.y, z: pos.z + 1 },
    { x: pos.x, y: pos.y - 1, z: pos.z },
    { x: pos.x, y: pos.y + 1, z: pos.z },
    { x: pos.x - 1, y: pos.y, z: pos.z },
    { x: pos.x + 1, y: pos.y, z: pos.z },
  ];
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
  countExposedCubeSides,
  countCubeSidesExposedToOutsideCubes,
  fillBigCubeAroundLavaDropletWithoutRecursion,
};
