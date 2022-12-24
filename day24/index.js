// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: null,
  asInteger: false,
  dontTrimInput: true,
});

const DIRECTIONS = Object.freeze({ NORTH: "north", SOUTH: "south", WEST: "west", EAST: "east" });
const { NORTH, SOUTH, WEST, EAST } = DIRECTIONS;

const EMPTY_COORDINATE = { x: 0, y: 0 };

module.exports = {
  getSolutionPart1,
  getSolutionPart2,
  parseLinesIntoSetup,

  hasBlizzard,
  findShortestWayBFS,
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
  return findShortestWayBFS({ setup, maxMinute: 5000, isPartOne: true, handleLogEvent });
}

function getSolutionPart2(handleLogEvent) {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  return findShortestWayBFS({ setup, maxMinute: 5000, isPartOne: false, handleLogEvent });
}

/**
 * @typedef SETUP
 * @property {BLIZZARD[]} blizzards
 * @property {COORDINATE} start
 * @property {COORDINATE} topLeft
 * @property {COORDINATE} bottomRight
 * @property {COORDINATE} finish
 * @property {COORDINATE} size
 */

/**
 * @typedef BLIZZARD
 * @property {COORDINATE} pos
 * @property {DIRECTION} dir
 */

/** @typedef {{ x: number, y: number }} COORDINATE */
/** @typedef {{ [y: number]: number[] }} COORDINATES_Y_X */
/** @typedef {"north" | "south" | "west" | "east"} DIRECTION */

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = {
    blizzards: [],
    start: { ...EMPTY_COORDINATE },
    topLeft: { x: 1, y: 1 },
    bottomRight: { ...EMPTY_COORDINATE },
    finish: { ...EMPTY_COORDINATE },
    size: { ...EMPTY_COORDINATE },
  };

  lines.forEach((line, y) => {
    if (line.includes("###")) {
      if (setup.start.x === 0) {
        setup.start = { x: line.indexOf("#.#") + 1, y };
      } else if (setup.finish.x === 0) {
        setup.finish = { x: line.indexOf("#.#") + 1, y };
        setup.bottomRight = { x: line.length - 2, y: y - 1 };
      }
    } else if (line) {
      for (let x = 0; x < line.length; x++) {
        const blizzardDir = { ">": EAST, "<": WEST, "^": NORTH, v: SOUTH }[line[x]];
        if (blizzardDir) {
          setup.blizzards.push({ pos: { x, y }, dir: blizzardDir });
        }
      }
    }
  });

  setup.size.x = setup.bottomRight.x - setup.topLeft.x + 1;
  setup.size.y = setup.bottomRight.y - setup.topLeft.y + 1;

  return setup;
}

/**
 * @param {object} inputBag
 * @param {SETUP} inputBag.setup
 * @param {number} inputBag.maxMinute
 * @param {boolean} inputBag.isPartOne
 * @param {Function | null} inputBag.handleLogEvent
 */
function findShortestWayBFS({ setup, maxMinute, isPartOne, handleLogEvent }) {
  const progress = new Helpers.Progress({ handleLogEvent }).init(maxMinute);

  const targets = isPartOne ? [setup.finish] : [setup.finish, setup.start, setup.finish];

  let currPathList = [[setup.start]];

  for (let minute = 1; minute <= maxMinute; minute++) {
    progress.step();

    const nextPathList = [];

    for (let i = 0; i < currPathList.length; i++) {
      const currPath = currPathList[i];
      const currPos = currPath[currPath.length - 1];

      const possibleNextPositions = [
        { x: currPos.x + 1, y: currPos.y },
        { x: currPos.x - 1, y: currPos.y },
        { x: currPos.x, y: currPos.y + 1 },
        { x: currPos.x, y: currPos.y - 1 },
        currPos,
      ];

      for (let i = 0; i < possibleNextPositions.length; i++) {
        const nextPos = possibleNextPositions[i];

        if (isSamePos(nextPos, setup.start) || isSamePos(nextPos, setup.finish)) {
          nextPathList.push([...currPath, nextPos]);
        } else if (
          nextPos.x >= setup.topLeft.x &&
          nextPos.x <= setup.bottomRight.x &&
          nextPos.y >= setup.topLeft.y &&
          nextPos.y <= setup.bottomRight.y &&
          !hasBlizzard({ setup, pos: nextPos, minute: minute + 1 })
        ) {
          nextPathList.push([...currPath, nextPos]);
        }
      }
    }

    const pathToTarget = nextPathList.find(path => isSamePos(path[path.length - 1], targets[0]));

    if (pathToTarget) {
      targets.splice(0, 1);
      if (targets.length === 0) {
        return minute;
      }
      currPathList = [pathToTarget];
    } else {
      const _isFirstPathWithGivenFinalPos = (path1, index) =>
        nextPathList.findIndex(path2 => isSamePos(path1[path1.length - 1], path2[path2.length - 1])) === index;

      currPathList = nextPathList.filter(_isFirstPathWithGivenFinalPos);
    }
  }

  return currPathList.map(path => JSON.stringify(path));
}

/** @param {COORDINATE} pos1 */
/** @param {COORDINATE} pos2 */
function isSamePos(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

/** @param {{ setup: SETUP, pos: COORDINATE, minute: number }} inputBag */
function hasBlizzard({ setup, pos, minute }) {
  const relativeStepX = (minute - 1) % setup.size.x;
  const relativeStepY = (minute - 1) % setup.size.y;

  if (pos.x === setup.start.x && pos.y === setup.start.y) {
    return false;
  }

  /** @param {BLIZZARD} blizzard */
  const _getPosY = blizzard => {
    let posY = blizzard.pos.y;
    if (blizzard.dir === NORTH) {
      posY -= relativeStepY;
      posY += posY < setup.topLeft.y ? setup.size.y : 0;
    }
    if (blizzard.dir === SOUTH) {
      posY += relativeStepY;
      posY -= posY > setup.bottomRight.y ? setup.size.y : 0;
    }
    return posY;
  };

  /** @param {BLIZZARD} blizzard */
  const _getPosX = blizzard => {
    let posX = blizzard.pos.x;
    if (blizzard.dir === WEST) {
      posX -= relativeStepX;
      posX += posX < setup.topLeft.x ? setup.size.x : 0;
    }
    if (blizzard.dir === EAST) {
      posX += relativeStepX;
      posX -= posX > setup.bottomRight.x ? setup.size.x : 0;
    }
    return posX;
  };

  for (let i = 0; i < setup.blizzards.length; i++) {
    /** @type {BLIZZARD} */
    const blizzard = setup.blizzards[i];
    if (_getPosX(blizzard) === pos.x && _getPosY(blizzard) === pos.y) {
      return true;
    }
  }

  return false;
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
