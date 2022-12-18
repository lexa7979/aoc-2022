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
  const result2 = playTetris(setup, 2022);
  const highestFallenStoneY = result2.reduce((acc, { y }) => Math.max(acc, y), 0) + 1;
  return highestFallenStoneY;
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const result2 = playTetris(setup, 1000000000000);
  const highestFallenStoneY = result2.reduce((acc, { y }) => Math.max(acc, y), 0) + 1;
  return highestFallenStoneY;
}

/**
 * @typedef SETUP
 * @property {Array<number>} movements
 */

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { movements: [] };

  lines.forEach(line => {
    if (line) {
      line.split("").forEach(char => {
        if (char === "<") {
          setup.movements.push(-1);
        } else if (char === ">") {
          setup.movements.push(1);
        }
      });
    }
  });

  return setup;
}

/** @param {SETUP} setup */
function playTetris(setup, numberOfStones) {
  /** @type {Array<{ x: number, y: number }>} */
  let fallenStoneCoordinates = [];

  const NUMBER_OF_STONE_TYPES = 5;

  let currStoneType = 0;
  let stoneCoordinatesRelative = getStoneCoordinates(currStoneType);
  let highestFallenStoneY = 0;
  /** @type {{ x: number, y: number }} */
  let currStonePos = { x: 2, y: 3 };

  let currStoneIndex = 0;
  let currDiffIndex = 0;

  /** @type {Array<{ y: number, count: number }>} */
  let tileCountPerLine = [];
  let lastCleanedLine = null;
  const _increaseTileCount = lineY => {
    const line = tileCountPerLine.find(({ y }) => y === lineY);
    if (line) {
      line.count++;
    } else {
      tileCountPerLine.push({ y: lineY, count: 1 });
    }
  };
  const _cleanTiles = statisticsCallback => {
    const linesWithSevenTiles = tileCountPerLine.filter(({ count }) => count === 7);
    if (linesWithSevenTiles.length > 0) {
      const fullLineY = Math.max(...linesWithSevenTiles.map(({ y }) => y));
      if (lastCleanedLine === fullLineY) {
        return;
      }
      lastCleanedLine = fullLineY;
      tileCountPerLine = tileCountPerLine.filter(({ y }) => y >= fullLineY);
      fallenStoneCoordinates = fallenStoneCoordinates.filter(({ y }) => y >= fullLineY);
      statisticsCallback && statisticsCallback({ fullLineY, currStoneType });
    }

    const linesWithSixTiles = tileCountPerLine.filter(({ count }) => count === 6);
    if (linesWithSixTiles.length > 0) {
      const almostFullLineY = Math.max(...linesWithSixTiles.map(item => item.y));
      if (lastCleanedLine === almostFullLineY) {
        return;
      }
      lastCleanedLine = almostFullLineY;
      const tilesOnLine = fallenStoneCoordinates.filter(item => item.y === almostFullLineY);
      const missingTileX = [0, 1, 2, 3, 4, 5, 6].filter(x => tilesOnLine.every(item => item.x !== x))[0];
      const closeTileWithMissingX = fallenStoneCoordinates.find(
        item => item.x === missingTileX && Math.abs(item.y - almostFullLineY) < 4
      );
      if (closeTileWithMissingX) {
        tileCountPerLine = tileCountPerLine.filter(({ y }) => y >= almostFullLineY);
        fallenStoneCoordinates = fallenStoneCoordinates.filter(({ y }) => y >= almostFullLineY);
        statisticsCallback && statisticsCallback({ almostFullLineY, missingTileX, closeTileWithMissingX });
      }
    }
  };

  const _isEmptyPlace = newTilePlace => {
    if (newTilePlace.x < 0 || newTilePlace.x > 6 || newTilePlace.y < 0) {
      return false;
    }
    return fallenStoneCoordinates.every(({ x, y }) => newTilePlace.x !== x || newTilePlace.y !== y);
  };

  const _canBeMoved = ({ diffX = 0, diffY = 0 }) => {
    for (let i = 0; i < stoneCoordinatesRelative.length; i++) {
      const stoneTileRelative = stoneCoordinatesRelative[i];
      const newTilePos = {
        x: currStonePos.x + stoneTileRelative.x + diffX,
        y: currStonePos.y + stoneTileRelative.y + diffY,
      };
      if (!_isEmptyPlace(newTilePos)) {
        return false;
      }
    }
    return true;
  };

  const _memorizeFallenStoneCoordinates = () => {
    for (let i = 0; i < stoneCoordinatesRelative.length; i++) {
      const stoneTileRelative = stoneCoordinatesRelative[i];
      const newTilePos = {
        x: currStonePos.x + stoneTileRelative.x,
        y: currStonePos.y + stoneTileRelative.y,
      };
      fallenStoneCoordinates.push(newTilePos);
      _increaseTileCount(newTilePos.y);
    }
  };

  const _initializeNextStone = newStoneType => {
    highestFallenStoneY = fallenStoneCoordinates.reduce((acc, { y }) => Math.max(acc, y), 0);
    currStonePos = { x: 2, y: highestFallenStoneY + 4 };
    currStoneType = newStoneType % NUMBER_OF_STONE_TYPES;
    stoneCoordinatesRelative = getStoneCoordinates(currStoneType);
  };

  const _simulateOneStoneFalling = () => {
    while (true) {
      const diffX = setup.movements[currDiffIndex];
      currDiffIndex = (currDiffIndex + 1) % setup.movements.length;
      if (_canBeMoved({ diffX })) {
        currStonePos.x += diffX;
      }
      if (_canBeMoved({ diffY: -1 })) {
        currStonePos.y--;
      } else {
        _memorizeFallenStoneCoordinates();
        return;
      }
    }
  };

  const loopStatistics = [];
  const _collectStatistic = numberOfItems => {
    for (; currStoneIndex < 1000000; currStoneIndex++) {
      if (loopStatistics.length >= numberOfItems) {
        return;
      }
      _simulateOneStoneFalling();
      _cleanTiles(data => {
        const tilesCount = fallenStoneCoordinates.length;
        if (loopStatistics.length === 0) {
          loopStatistics.push({ ...data, currStoneType, currStoneIndex, tilesCount });
        } else if (loopStatistics[0].currStoneType === currStoneType && loopStatistics[0].tilesCount === tilesCount) {
          loopStatistics.push({
            ...data,
            currStoneType,
            currStoneIndex,
            tilesCount,
          });
        }
      });
      _initializeNextStone(currStoneType + 1);
    }
    throw new Error("Failed to collect statistics");
  };

  const _compareStatisticItems = (item1, item2) => {
    if (item1.fullLineY && item2.fullLineY) {
      if (item1.currStoneType !== item2.currStoneType || item1.tilesCount !== item2.tilesCount) {
        throw new Error("Can't compare statistic items");
      }
      const diffLineY = item2.fullLineY - item1.fullLineY;
      const diffIndex = item2.currStoneIndex - item1.currStoneIndex;
      return { diffLineY, diffIndex };
    }
    if (item1.almostFullLineY && item2.almostFullLineY) {
      if (
        item1.missingTileX !== item2.missingTileX ||
        item1.currStoneType !== item2.currStoneType ||
        item1.tilesCount !== item2.tilesCount ||
        item1.closeTileWithMissingX.y - item1.almostFullLineY !== item2.closeTileWithMissingX.y - item2.almostFullLineY
      ) {
        throw new Error("Can't compare statistic items");
      }
      const diffLineY = item2.almostFullLineY - item1.almostFullLineY;
      const diffIndex = item2.currStoneIndex - item1.currStoneIndex;
      return { diffLineY, diffIndex };
    }
    throw new Error("Can't compare statistic items");
  };

  const _fastForwardLoopBasedOnStatistics = () => {
    const comparison1 = _compareStatisticItems(loopStatistics[0], loopStatistics[1]);
    const comparison2 = _compareStatisticItems(loopStatistics[1], loopStatistics[2]);
    if (comparison1.diffLineY !== comparison2.diffLineY || comparison1.diffIndex !== comparison2.diffIndex) {
      throw new Error("Can't use statistics");
    }

    const loopCount = Math.floor((numberOfStones - currStoneIndex) / comparison1.diffIndex);
    currStoneIndex += loopCount * comparison1.diffIndex;
    fallenStoneCoordinates = fallenStoneCoordinates.map(item => ({
      x: item.x,
      y: item.y + loopCount * comparison1.diffLineY,
    }));
  };

  if (numberOfStones > 100) {
    _collectStatistic(5);
    loopStatistics.shift();
    _fastForwardLoopBasedOnStatistics();
    _initializeNextStone(currStoneType);
  }

  for (let i = currStoneIndex; i < numberOfStones; i++) {
    _simulateOneStoneFalling();
    _initializeNextStone(currStoneType + 1);
  }

  return fallenStoneCoordinates;
}

function getStoneCoordinates(type) {
  return [
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ],
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
  ][type];
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
  playTetris,
  getStoneCoordinates,
};
