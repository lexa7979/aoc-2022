// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: null,
  asInteger: false,
  dontTrimInput: true,
});

const HEAD_RIGHT = "+x";
const HEAD_LEFT = "-x";
const HEAD_DOWN = "+y";
const HEAD_UP = "-y";

const CUBE_SIDES = Object.freeze({
  TOP: "top",
  LEFT: "left",
  RIGHT: "right",
  FRONT: "front",
  BACK: "back",
  BOTTOM: "bottom",
});

const SETUP_TYPES = Object.freeze({
  EXAMPLE: "example",
  INPUTFILE: "inputfile",
});

module.exports = {
  getSolutionPart1,
  getSolutionPart2,
  parseLinesIntoSetup,

  followPath,
  getPassword,
  mapSetupOntoCube,
  followPathOnCube,
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
  return getPassword(setup, handleLogEvent, true);
}

function getSolutionPart2(handleLogEvent) {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  return getPassword(setup, handleLogEvent, false);
}

/**
 * @typedef SETUP
 * @property {object} map
 * @property {{ [y: number]: number[]}} map.groundYX
 * @property {{ [y: number]: number[]}} map.stonesYX
 * @property {Array<string | number>} movements
 */

/**
 * @typedef COORDINATE
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef CUBE_SETUP
 * @property {number} dimension
 * @property {string} type
 * @property {COORDINATE} max
 * @property {COORDINATE} start
 * @property {{ [key: string]: { start: COORDINATE, end: COORDINATE } }} sidesOfCube
 */
function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { map: { groundYX: {}, stonesYX: {} }, movements: [] };

  let isParsingMap = true;
  lines.forEach((line, columnIndex) => {
    if (!line) {
      isParsingMap = false;
    } else if (isParsingMap) {
      for (let pos = 0; pos < line.length; pos++) {
        if (line[pos] === "." || line[pos] === "#") {
          const list = line[pos] === "." ? setup.map.groundYX : setup.map.stonesYX;
          if (!list[columnIndex + 1]) {
            list[columnIndex + 1] = [];
          }
          list[columnIndex + 1].push(pos + 1);
        }
      }
    } else {
      const regexp = /\d+|\D/g;
      let match = regexp.exec(line);
      while (match) {
        if (match[0] === "L" || match[0] === "R") {
          setup.movements.push(match[0]);
        } else {
          const steps = parseInt(match[0]);
          if (Number.isNaN(steps) || (steps === 0 && match[0] !== "0")) {
            throw new Error("Failed parsing movements");
          }
          setup.movements.push(steps);
        }
        match = regexp.exec(line);
      }
    }
  });

  return setup;
}

/** @param {SETUP} setup */
/** @param {Function | null} handleLogEvent */
function followPath(setup, handleLogEvent) {
  const GROUND = "ground";
  const STONE = "stone";

  const progress = new Helpers.Progress({ handleLogEvent }).init(setup.movements.length);
  const log = new Helpers.NoLog();

  const maxY = Math.max(...Object.keys(setup.map.groundYX).map(key => parseInt(key, 10)));

  const currPos = { x: Math.min(...setup.map.groundYX[1]), y: 1 };
  let currDir = HEAD_RIGHT;

  log.add({ currPos: { ...currPos }, currDir });

  const _getPosType = (x, y) => {
    const isGround = setup.map.groundYX[y]?.includes(x);
    const isStone = setup.map.stonesYX[y]?.includes(x);
    if (isGround || isStone) {
      return isGround ? GROUND : STONE;
    }
    return null;
  };

  const _checkPos = (x, y, callbackIfNothingOnPos) => {
    const type = _getPosType(x, y);
    if (type) {
      return type === GROUND ? { x, y } : null;
    }
    return callbackIfNothingOnPos();
  };

  const _getNextPos = () => {
    switch (currDir) {
      case HEAD_RIGHT:
        return _checkPos(currPos.x + 1, currPos.y, () => {
          for (let x = 1; x < currPos.x; x++) {
            const type = _getPosType(x, currPos.y);
            if (type) {
              return type === GROUND ? { x, y: currPos.y } : null;
            }
          }
        });

      case HEAD_DOWN:
        return _checkPos(currPos.x, currPos.y + 1, () => {
          for (let y = 1; y < currPos.y; y++) {
            const type = _getPosType(currPos.x, y);
            if (type) {
              return type === GROUND ? { x: currPos.x, y: y } : null;
            }
          }
        });

      case HEAD_LEFT: {
        const maxX = Math.max(...setup.map.groundYX[currPos.y], ...setup.map.stonesYX[currPos.y]);
        return _checkPos(currPos.x - 1, currPos.y, () => {
          for (let x = maxX; x > currPos.x; x--) {
            const type = _getPosType(x, currPos.y);
            if (type) {
              return type === GROUND ? { x, y: currPos.y } : null;
            }
          }
        });
      }

      case HEAD_UP:
        return _checkPos(currPos.x, currPos.y - 1, () => {
          for (let y = maxY; y > currPos.y; y--) {
            const type = _getPosType(currPos.x, y);
            if (type) {
              return type === GROUND ? { x: currPos.x, y } : null;
            }
          }
        });
    }

    return null;
  };

  setup.movements.forEach((move, index) => {
    progress.step(index);

    log.add({ currPos: { ...currPos }, currDir, move });

    if (move === "L") {
      currDir = { [HEAD_RIGHT]: HEAD_UP, [HEAD_UP]: HEAD_LEFT, [HEAD_LEFT]: HEAD_DOWN, [HEAD_DOWN]: HEAD_RIGHT }[
        currDir
      ];
      return;
    }

    if (move === "R") {
      currDir = { [HEAD_RIGHT]: HEAD_DOWN, [HEAD_DOWN]: HEAD_LEFT, [HEAD_LEFT]: HEAD_UP, [HEAD_UP]: HEAD_RIGHT }[
        currDir
      ];
      return;
    }

    for (let steps = 0; steps < move; steps++) {
      const nextPos = _getNextPos();
      if (nextPos) {
        currPos.x = nextPos.x;
        currPos.y = nextPos.y;
      } else {
        break;
      }
    }
  });

  log.add({ currPos: { ...currPos }, currDir });

  progress.finalize();
  log.done();

  return { pos: currPos, dir: currDir };
}

/** @param {SETUP} setup */
/** @param {Function | null} handleLogEvent */
/** @param {boolean} isPartOne */
function getPassword(setup, handleLogEvent, isPartOne) {
  const { pos, dir } = isPartOne
    ? followPath(setup, handleLogEvent)
    : followPathOnCube(setup, mapSetupOntoCube(setup), handleLogEvent);

  let result = 4 * pos.x + 1000 * pos.y;

  result += { [HEAD_RIGHT]: 0, [HEAD_DOWN]: 1, [HEAD_LEFT]: 2, [HEAD_UP]: 3 }[dir];

  return result;
}

/** @param {SETUP} setup */
function mapSetupOntoCube(setup) {
  /** @type {CUBE_SETUP} */
  const result = {
    dimension: 0,
    type: "",
    max: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    sidesOfCube: {},
  };

  /** @type {{ [key: string]: COORDINATE }} */
  let sideDiff = {};

  [...Object.values(setup.map.groundYX), ...Object.values(setup.map.stonesYX)].forEach(list => {
    result.max.x = Math.max(result.max.x, ...list);
  });
  result.max.y = Math.max(...Object.keys(setup.map.groundYX).map(key => parseInt(key, 10)));

  if (result.max.x === 16 && result.max.y === 12) {
    result.dimension = 4;
    result.type = SETUP_TYPES.EXAMPLE;
    sideDiff = {
      [CUBE_SIDES.TOP]: { x: 0, y: 0 },
      [CUBE_SIDES.FRONT]: { x: 0, y: 1 },
      [CUBE_SIDES.BOTTOM]: { x: 0, y: 2 },
      [CUBE_SIDES.BACK]: { x: -2, y: 1 },
      [CUBE_SIDES.LEFT]: { x: -1, y: 1 },
      [CUBE_SIDES.RIGHT]: { x: 1, y: 2 },
    };
  } else if (result.max.x === 150 && result.max.y === 200) {
    result.dimension = 50;
    result.type = SETUP_TYPES.INPUTFILE;
    sideDiff = {
      [CUBE_SIDES.TOP]: { x: 0, y: 0 },
      [CUBE_SIDES.FRONT]: { x: 0, y: 1 },
      [CUBE_SIDES.BOTTOM]: { x: 0, y: 2 },
      [CUBE_SIDES.BACK]: { x: -1, y: 3 },
      [CUBE_SIDES.LEFT]: { x: -1, y: 2 },
      [CUBE_SIDES.RIGHT]: { x: 1, y: 0 },
    };
  } else {
    throw new Error(`Unknown setup (max: ${result.max.x};${result.max.y})`);
  }

  result.start.x = Math.min(...setup.map.groundYX[1]);
  result.start.y = 1;

  const _getCoordinateOfTopLeftCorner = side => {
    const diff = sideDiff[side];
    const x = result.start.x + diff.x * result.dimension;
    const y = result.start.y + diff.y * result.dimension;
    return { x, y };
  };
  const _getCoordinateOfBottomRightCorner = side => {
    const diff = sideDiff[side];
    const x = result.start.x + diff.x * result.dimension + result.dimension - 1;
    const y = result.start.y + diff.y * result.dimension + result.dimension - 1;
    return { x, y };
  };

  Object.values(CUBE_SIDES).forEach(side => {
    result.sidesOfCube[side] = {
      start: _getCoordinateOfTopLeftCorner(side),
      end: _getCoordinateOfBottomRightCorner(side),
    };
  });

  return result;
}

/** @param {SETUP} setup */
/** @param {CUBE_SETUP} cubeSetup */
/** @param {Function | null} handleLogEvent */
function followPathOnCube(setup, cubeSetup, handleLogEvent) {
  const GROUND = "ground";
  const STONE = "stone";

  const currPos = cubeSetup.start;
  let currDir = HEAD_RIGHT;

  const log = new Helpers.NoLog();

  const _getPosType = (x, y) => {
    const isGround = setup.map.groundYX[y]?.includes(x);
    const isStone = setup.map.stonesYX[y]?.includes(x);
    if (isGround || isStone) {
      return isGround ? GROUND : STONE;
    }
    return null;
  };

  const _getNonAdjacentPosAndDir = () => {
    const currSide = Object.keys(cubeSetup.sidesOfCube).find(key => {
      const { start, end } = cubeSetup.sidesOfCube[key];
      return currPos.x >= start.x && currPos.x <= end.x && currPos.y >= start.y && currPos.y <= end.y;
    });
    if (!currSide) {
      throw new Error(`_getNonAdjacentPosAndDir(): Failed to find currSide (currPos: ${currPos.x};${currPos.y})`);
    }
    log.add(`currSide: ${currSide}, dir: ${currDir}`);

    /** @type {{ start: COORDINATE, end: COORDINATE }} */
    const currCubeSide = cubeSetup.sidesOfCube[currSide];

    const __getResult = (nextSide, xVariant, yVariant, nextDir) => {
      const nextCubeSide = cubeSetup.sidesOfCube[nextSide];
      const pos = {};
      const diff = { x: currPos.x - currCubeSide.start.x, y: currPos.y - currCubeSide.start.y };
      switch (xVariant) {
        case "startX":
        case "endX":
          pos.x = nextCubeSide[xVariant === "startX" ? "start" : "end"].x;
          break;
        case "endX-diffX":
        case "endX-diffY":
          pos.x = nextCubeSide.end.x - diff[xVariant.endsWith("diffX") ? "x" : "y"];
          break;
        case "startX+diffX":
        case "startX+diffY":
          pos.x = nextCubeSide.start.x + diff[xVariant.endsWith("diffX") ? "x" : "y"];
          break;
        default:
          throw new Error(`Invalid xVariant (${xVariant})`);
      }
      switch (yVariant) {
        case "startY":
        case "endY":
          pos.y = nextCubeSide[yVariant === "startY" ? "start" : "end"].y;
          break;
        case "endY-diffY":
          pos.y = nextCubeSide.end.y - diff.y;
          break;
        case "startY+diffX":
          pos.y = nextCubeSide.start.y + diff.x;
          break;
        default:
          throw new Error(`Invalid yVariant (${yVariant})`);
      }
      return { pos, dir: nextDir };
    };

    if (cubeSetup.type === SETUP_TYPES.EXAMPLE) {
      if (currSide === CUBE_SIDES.FRONT && currDir === HEAD_RIGHT) {
        return __getResult(CUBE_SIDES.RIGHT, "endX-diffY", "startY", HEAD_DOWN);
      }
      if (currSide === CUBE_SIDES.BOTTOM && currDir === HEAD_LEFT) {
        return __getResult(CUBE_SIDES.LEFT, "endX-diffY", "endY", HEAD_UP);
      }
      if (currSide === CUBE_SIDES.BOTTOM && currDir === HEAD_DOWN) {
        return __getResult(CUBE_SIDES.BACK, "endX-diffX", "endY", HEAD_UP);
      }
      if (currSide === CUBE_SIDES.LEFT && currDir === HEAD_UP) {
        return __getResult(CUBE_SIDES.TOP, "startX", "startY+diffX", HEAD_RIGHT);
      }
      if (currSide === CUBE_SIDES.TOP && currDir === HEAD_UP) {
        return __getResult(CUBE_SIDES.BACK, "endX-diffX", "startY", HEAD_DOWN);
      }
    }

    if (cubeSetup.type === SETUP_TYPES.INPUTFILE) {
      if (currSide === CUBE_SIDES.TOP && currDir === HEAD_UP) {
        return __getResult(CUBE_SIDES.BACK, "startX", "startY+diffX", HEAD_RIGHT);
      }
      if (currSide === CUBE_SIDES.LEFT && currDir === HEAD_UP) {
        return __getResult(CUBE_SIDES.FRONT, "startX", "startY+diffX", HEAD_RIGHT);
      }
      if (currSide === CUBE_SIDES.RIGHT && currDir === HEAD_DOWN) {
        return __getResult(CUBE_SIDES.FRONT, "endX", "startY+diffX", HEAD_LEFT);
      }
      if (currSide === CUBE_SIDES.FRONT && currDir === HEAD_RIGHT) {
        return __getResult(CUBE_SIDES.RIGHT, "startX+diffY", "endY", HEAD_UP);
      }
      if (currSide === CUBE_SIDES.RIGHT && currDir === HEAD_UP) {
        return __getResult(CUBE_SIDES.BACK, "startX+diffX", "endY", HEAD_UP);
      }
      if (currSide === CUBE_SIDES.BACK && currDir === HEAD_LEFT) {
        return __getResult(CUBE_SIDES.TOP, "startX+diffY", "startY", HEAD_DOWN);
      }
      if (currSide === CUBE_SIDES.BACK && currDir === HEAD_DOWN) {
        return __getResult(CUBE_SIDES.RIGHT, "startX+diffX", "startY", HEAD_DOWN);
      }
      if (currSide === CUBE_SIDES.RIGHT && currDir === HEAD_RIGHT) {
        return __getResult(CUBE_SIDES.BOTTOM, "endX", "endY-diffY", HEAD_LEFT);
      }
      if (currSide === CUBE_SIDES.FRONT && currDir === HEAD_LEFT) {
        return __getResult(CUBE_SIDES.LEFT, "startX+diffY", "startY", HEAD_DOWN);
      }
      if (currSide === CUBE_SIDES.LEFT && currDir === HEAD_LEFT) {
        return __getResult(CUBE_SIDES.TOP, "startX", "endY-diffY", HEAD_RIGHT);
      }
      if (currSide === CUBE_SIDES.TOP && currDir === HEAD_LEFT) {
        return __getResult(CUBE_SIDES.LEFT, "startX", "endY-diffY", HEAD_RIGHT);
      }
      if (currSide === CUBE_SIDES.BACK && currDir === HEAD_RIGHT) {
        return __getResult(CUBE_SIDES.BOTTOM, "startX+diffY", "endY", HEAD_UP);
      }
      if (currSide === CUBE_SIDES.BOTTOM && currDir === HEAD_RIGHT) {
        return __getResult(CUBE_SIDES.RIGHT, "endX", "endY-diffY", HEAD_LEFT);
      }
      if (currSide === CUBE_SIDES.BOTTOM && currDir === HEAD_DOWN) {
        return __getResult(CUBE_SIDES.BACK, "endX", "startY+diffX", HEAD_LEFT);
      }
    }

    throw new Error(`_getNonAdjacentPosAndDir(): Unsupported situation (currSide: ${currSide}, dir: ${currDir})`);
  };

  const _getNextPosAndDir = () => {
    const adjacentPos = {
      [HEAD_RIGHT]: { x: currPos.x + 1, y: currPos.y },
      [HEAD_DOWN]: { x: currPos.x, y: currPos.y + 1 },
      [HEAD_LEFT]: { x: currPos.x - 1, y: currPos.y },
      [HEAD_UP]: { x: currPos.x, y: currPos.y - 1 },
    }[currDir];

    const type = _getPosType(adjacentPos.x, adjacentPos.y);
    if (type) {
      return type === GROUND ? { pos: adjacentPos, dir: currDir } : null;
    }

    const nonAdjacentPosAndDir = _getNonAdjacentPosAndDir();
    const type2 = _getPosType(nonAdjacentPosAndDir.pos.x, nonAdjacentPosAndDir.pos.y);
    return type2 && type2 === GROUND ? nonAdjacentPosAndDir : null;
  };

  const _turn = move => {
    return {
      [HEAD_RIGHT]: move === "L" ? HEAD_UP : HEAD_DOWN,
      [HEAD_UP]: move === "L" ? HEAD_LEFT : HEAD_RIGHT,
      [HEAD_LEFT]: move === "L" ? HEAD_DOWN : HEAD_UP,
      [HEAD_DOWN]: move === "L" ? HEAD_RIGHT : HEAD_LEFT,
    }[currDir];
  };

  log.add(`    ${currPos.x};${currPos.y} (${currDir})`);

  const progress = new Helpers.Progress({ handleLogEvent }).init(setup.movements.length);
  setup.movements.forEach((move, index) => {
    progress.step(index);

    if (move === "L" || move === "R") {
      currDir = _turn(move);
    } else {
      for (let steps = 0; steps < move; steps++) {
        const nextPosAndDir = _getNextPosAndDir();
        if (nextPosAndDir) {
          currPos.x = nextPosAndDir.pos.x;
          currPos.y = nextPosAndDir.pos.y;
          currDir = nextPosAndDir.dir;
        } else {
          break;
        }
      }
    }

    log.add(`${move}: ${currPos.x};${currPos.y} (${currDir})`);
  });
  progress.finalize();

  log.done();

  return { pos: currPos, dir: currDir };
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
