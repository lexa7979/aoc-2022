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
  return countNonBeaconCoordinatesOfLine(setup, 2000000);
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  for (let lineY = 0; lineY <= 4000000; lineY++) {
    const posXList = getBeaconCoordinatesOfLine(setup, lineY);
    if (posXList[0]) {
      return posXList[0] * 4000000 + lineY;
    }
  }
}

/**
 * @typedef SETUP
 * @property {Array<object>} sensors
 * @property {Array<object>} knownBeacons
 */

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { sensors: [], knownBeacons: [] };

  lines.forEach(line => {
    if (line) {
      const match = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/.exec(line);
      if (match) {
        const closestBeacon = { x: parseInt(match[3], 10), y: parseInt(match[4], 10) };
        setup.sensors.push({ x: parseInt(match[1], 10), y: parseInt(match[2], 10), closestBeacon });
        if (setup.knownBeacons.every(beacon => beacon.x !== closestBeacon.x || beacon.y !== closestBeacon.y)) {
          setup.knownBeacons.push(closestBeacon);
        }
      }
    }
  });

  return setup;
}

/** @param {SETUP} setup */
/** @param {number} lineY */
function countNonBeaconCoordinatesOfLine(setup, lineY) {
  const ranges = _getRangesOfNonBeaconCoordinatesOfLine(setup, lineY);

  const beaconsInLine = setup.knownBeacons.filter(beacon => beacon.y === lineY);

  let numberOfNonBeaconCoordinates = 0;
  ranges.forEach(({ minX, maxX }) => {
    const beaconsInRange = beaconsInLine.filter(beacon => minX <= beacon.x && beacon.x <= maxX);
    numberOfNonBeaconCoordinates += maxX - minX + 1 - beaconsInRange.length;
  });

  return numberOfNonBeaconCoordinates;
}

/** @param {SETUP} setup */
function getBeaconCoordinatesOfLine(setup, lineY) {
  const _isWithin = (x, minX, maxX) => x >= minX && x <= maxX;

  const ranges = _getRangesOfNonBeaconCoordinatesOfLine(setup, lineY);

  if (ranges.length > 1) {
    const totalMinX = ranges.reduce((acc, curr) => Math.min(curr.minX, acc), Number.MAX_VALUE);
    const totalMaxX = ranges.reduce((acc, curr) => Math.max(curr.maxX, acc), Number.MIN_VALUE);

    const results = [];
    for (let x = totalMinX; x <= totalMaxX; x++) {
      if (ranges.every(({ minX, maxX }) => !_isWithin(x, minX, maxX))) {
        results.push(x);
      }
    }
    return results;
  }

  return [];
}

function _getRangesOfNonBeaconCoordinatesOfLine(setup, lineY) {
  /** @type {Array<{ minX: number, maxX: number }>} */
  let ranges = [];

  const _distance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

  const _normalizeRanges = () => {
    /** @type {Array<{ minX: number, maxX: number }>} */
    const newRanges = [ranges[0]];
    for (let index = 1; index < ranges.length; index++) {
      const range = ranges[index];
      const targetIndex = newRanges.findIndex(target => range.minX <= target.maxX + 1 && range.maxX >= target.minX - 1);
      if (targetIndex >= 0) {
        newRanges[targetIndex] = {
          minX: Math.min(newRanges[targetIndex].minX, range.minX),
          maxX: Math.max(newRanges[targetIndex].maxX, range.maxX),
        };
      } else {
        newRanges.push(range);
      }
    }
    ranges = newRanges;
  };

  setup.sensors.forEach(sensor => {
    const beaconDistance = _distance(sensor.x, sensor.y, sensor.closestBeacon.x, sensor.closestBeacon.y);

    const sensorDiffY = Math.abs(sensor.y - lineY);
    if (sensorDiffY > beaconDistance) {
      return;
    }

    const minX = sensor.x - beaconDistance + sensorDiffY;
    const maxX = sensor.x + beaconDistance - sensorDiffY;
    ranges.push({ minX, maxX });
    _normalizeRanges();
  });

  _normalizeRanges();

  return ranges;
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
  countNonBeaconCoordinatesOfLine,
  getBeaconCoordinatesOfLine,
};
