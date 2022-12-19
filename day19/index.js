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

function getSolutionPart1(handleLogEvent) {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, true);

  const progress = new Helpers.Progress({ handleLogEvent });
  progress.init(setup.blueprints.length);

  const qualityLevels = setup.blueprints.map((blueprint, index) => {
    progress.step(index);

    return getQualityLevel(blueprint, handleLogEvent);
  });

  progress.finalize();

  return qualityLevels.reduce((acc, curr) => acc + curr, 0);
}

function getSolutionPart2(handleLogEvent) {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
}

const ORE = "ore";
const CLAY = "clay";
const OBSIDIAN = "obsidian";
const GEODE = "geode";
const RESOURCE_TYPES = [ORE, CLAY, OBSIDIAN, GEODE];

const TRY_TO_BUILD_MORE_THAN_ONE_ROBOT_PER_MINUTE = true;
const NUMBER_OF_ROBOTS_WHICH_CAN_BE_BUILD_PER_MINUTE = 1;
const TRY_TO_BUILD_FIRST_ROBOTS_AS_SOON_AS_POSSIBLE = true;
const MINUTES_TO_ALLOW_FIRST_ROBOTS_TO_BE_BUILD_LATER = 1;

/**
 * @typedef SETUP
 * @property {Array<BLUEPRINT>} blueprints
 */

/**
 * @typedef BLUEPRINT
 * @property {number} id
 * @property {RESOURCES} oreRobotCost
 * @property {RESOURCES} clayRobotCost
 * @property {RESOURCES} obsidianRobotCost
 * @property {RESOURCES} geodeRobotCost
 */

/**
 * @typedef RESOURCES
 * @property {number} [ore]
 * @property {number} [clay]
 * @property {number} [obsidian]
 * @property {number} [geode]
 */

/**
 * @typedef BEST_RESULT
 * @property {RESOURCES} resources
 * @property {RESOURCES} robots
 * @property {RESOURCES} buildMinuteOfFirstRobots
 */

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { blueprints: [] };

  lines.forEach(line => {
    if (line) {
      const match =
        /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./.exec(
          line
        );
      if (!match) {
        throw new Error("Failed to parse line");
      }
      const numbers = [1, 2, 3, 4, 5, 6, 7].map(key => parseInt(match[key], 10));
      setup.blueprints.push({
        id: numbers[0],
        oreRobotCost: { [ORE]: numbers[1] },
        clayRobotCost: { [ORE]: numbers[2] },
        obsidianRobotCost: { [ORE]: numbers[3], [CLAY]: numbers[4] },
        geodeRobotCost: { [ORE]: numbers[5], [OBSIDIAN]: numbers[6] },
      });
    }
  });

  return setup;
}

class ResultWithMostGeodes {
  /**
   * @param {object} inputBag
   * @param {BLUEPRINT} inputBag.blueprint
   * @param {number} [inputBag.maxMinutes]
   * @param {Function | null} [inputBag.handleLogEvent]
   */
  constructor({ blueprint, maxMinutes = 24, handleLogEvent = null }) {
    /** @type {BLUEPRINT} */
    this.blueprint = blueprint;
    this.maxMinutes = maxMinutes;
    /** @type {import("./helpers").Progress} */
    this.progress = new Helpers.Progress({ handleLogEvent });
    this.log = [];

    /** @type {RESOURCES} */
    this.costsByRobotType = {};
    RESOURCE_TYPES.forEach(robotType => {
      this.costsByRobotType[robotType] = this.blueprint[`${robotType}RobotCost`];
    });

    /** @type {BEST_RESULT | null} */
    this.bestResult = null;
  }

  /**
   * @returns {BEST_RESULT | null}
   */
  getResult() {
    this.bestResult = null;
    this._recursion({});
    this.log.length && this.log.length < 100 && console.log(this.log);
    return this.bestResult;
  }

  /**
   * @param {object} inputBag
   * @param {number} [inputBag.minute]
   * @param {RESOURCES} [inputBag.currRobots]
   * @param {RESOURCES} [inputBag.newRobots]
   * @param {RESOURCES} [inputBag.currResources]
   * @param {RESOURCES} [inputBag.buildMinuteOfFirstRobots]
   */
  _recursion(inputBag) {
    const {
      minute = 1,
      currRobots = { [ORE]: 1 },
      newRobots = {},
      currResources = {},
      buildMinuteOfFirstRobots = { [ORE]: 1 },
    } = inputBag;

    /** @param {RESOURCES} resources */
    const _printResources = resources =>
      `${resources.ore || 0},${resources.clay || 0},${resources.obsidian || 0},${resources.geode || 0}`;

    if (minute === this.maxMinutes) {
      if (this._checkIfFinalResultIsBetter({ currResources, buildMinuteOfFirstRobots })) {
        this.bestResult = { robots: currRobots, resources: currResources, buildMinuteOfFirstRobots };
      }
      return;
    }

    if (this._checkIfIsBadResultAlready({ minute, buildMinuteOfFirstRobots })) {
      return;
    }

    // if (TRY_TO_BUILD_MORE_THAN_ONE_ROBOT_PER_MINUTE) {
    //   throw new Error("Not implemented, yet");
    // }

    const nextResources = this._getIncreasedResources({ currResources, changes: currRobots });

    this._recursion({
      minute: minute + 1,
      currRobots: this._getIncreasedResources({ currResources: currRobots, changes: newRobots }),
      newRobots: {},
      currResources: nextResources,
      buildMinuteOfFirstRobots,
    });

    const numberOfNewRobots = Object.values(newRobots).reduce((acc, curr) => acc + curr, 0);

    if (numberOfNewRobots < NUMBER_OF_ROBOTS_WHICH_CAN_BE_BUILD_PER_MINUTE) {
      RESOURCE_TYPES.filter(robotType => this._checkIfIsEnoughResourcesToBuild({ currResources, robotType })).forEach(
        robotType => {
          const increasedRobots = this._getIncreasedResources({
            currResources: newRobots,
            changes: { [robotType]: 1 },
          });
          const decreasedResources = this._getDecreasedResources({
            currResources,
            changes: this.costsByRobotType[robotType],
          });
          const updatedBuildMinutes = { ...buildMinuteOfFirstRobots };
          if (!updatedBuildMinutes[robotType]) {
            updatedBuildMinutes[robotType] = minute;
          }

          this._recursion({
            minute: minute,
            currRobots,
            newRobots: increasedRobots,
            currResources: decreasedResources,
            buildMinuteOfFirstRobots: updatedBuildMinutes,
          });
        }
      );
    }
  }

  _log(data) {
    this.log.length === 100 && console.log(this.log);
    this.log.length < 101 && this.log.push(data);
  }

  _checkIfIsBadResultAlready({ minute, buildMinuteOfFirstRobots }) {
    // this._log({ minute, buildMinuteOfFirstRobots });

    if (TRY_TO_BUILD_FIRST_ROBOTS_AS_SOON_AS_POSSIBLE) {
      const _firstRobotWasBuiltTooLate = robotType => {
        const bestBuildMinute = this.bestResult?.buildMinuteOfFirstRobots[robotType];
        if (!bestBuildMinute) {
          return false;
        }
        const currBuildMinute = buildMinuteOfFirstRobots[robotType];
        if (currBuildMinute) {
          return currBuildMinute > bestBuildMinute + MINUTES_TO_ALLOW_FIRST_ROBOTS_TO_BE_BUILD_LATER;
        }
        return minute > bestBuildMinute + MINUTES_TO_ALLOW_FIRST_ROBOTS_TO_BE_BUILD_LATER;
        // return currBuildMinute ? currBuildMinute > bestBuildMinute : minute > bestBuildMinute;
      };

      if ([CLAY, OBSIDIAN, GEODE].some(_firstRobotWasBuiltTooLate)) {
        return true;
      }
    }

    return false;
  }

  _checkIfFinalResultIsBetter({ currResources, buildMinuteOfFirstRobots }) {
    if (!this.bestResult) {
      return true;
    }
    if (currResources.geode === this.bestResult.resources.geode) {
      for (let i = 0; i < 4; i++) {
        const robotType = [GEODE, OBSIDIAN, CLAY, ORE][i];
        if (buildMinuteOfFirstRobots[robotType]) {
          if (!this.bestResult.buildMinuteOfFirstRobots[robotType]) {
            return true;
          }
          if (this.bestResult.buildMinuteOfFirstRobots[robotType] > buildMinuteOfFirstRobots[robotType]) {
            return true;
          }
          if (this.bestResult.buildMinuteOfFirstRobots[robotType] < buildMinuteOfFirstRobots[robotType]) {
            return false;
          }
        }
      }
      return this._areMoreOrSameResources({ newResources: currResources, oldResources: this.bestResult.resources });
    }
    // @ts-ignore
    return currResources.geode > this.bestResult.resources.geode;
  }

  _checkIfIsEnoughResourcesToBuild({ currResources, robotType }) {
    const robotCosts = this.costsByRobotType[robotType];
    return RESOURCE_TYPES.every(type => !robotCosts[type] || robotCosts[type] <= currResources[type]);
  }

  /** @param {{ currResources: RESOURCES, changes: RESOURCES }} inputBag */
  _getIncreasedResources({ currResources, changes }) {
    const result = {};
    RESOURCE_TYPES.forEach(type => {
      result[type] = (currResources[type] || 0) + (changes[type] || 0);
    });
    return result;
  }

  /** @param {{ currResources: RESOURCES, changes: RESOURCES }} inputBag */
  _getDecreasedResources({ currResources, changes }) {
    const result = {};
    RESOURCE_TYPES.forEach(type => {
      result[type] = (currResources[type] || 0) - (changes[type] || 0);
    });
    return result;
  }

  _areSameResources({ newResources, oldResources }) {
    return RESOURCE_TYPES.every(type => newResources[type] === oldResources[type]);
  }

  _areLessOrSameResources({ newResources, oldResources }) {
    return RESOURCE_TYPES.every(type => newResources[type] <= oldResources[type]);
  }

  _areMoreOrSameResources({ newResources, oldResources }) {
    return RESOURCE_TYPES.every(type => newResources[type] >= oldResources[type]);
  }
}

// /** @param {number} numberOfSteps */
// /** @param {Function} yieldCallback */
// /** @param {Function} handleLogEvent */
// function yieldRobotBuildDecisions(numberOfSteps, yieldCallback, handleLogEvent) {
//   const progress = new Helpers.Progress({ handleLogEvent });

//   let isRunning = true;
//   const _yield = data => {
//     if (yieldCallback) {
//       isRunning = yieldCallback(data);
//     }
//   };

//   const _recursion = ({ currBuildSteps }) => {
//     if (currBuildSteps.length === numberOfSteps) {
//       _yield(currBuildSteps);
//     } else {
//       _recursion({ currBuildSteps: [...currBuildSteps, null] });
//       RESOURCE_TYPES.forEach(type => {
//         _recursion({ currBuildSteps: [...currBuildSteps, type] });
//       });
//     }
//   };

//   _recursion({ currBuildSteps: [] });
// }

/** @param {BLUEPRINT} blueprint */
/** @param {Function} handleLogEvent */
/** @param {boolean} isPartOne */
function getQualityLevel(blueprint, handleLogEvent, isPartOne) {
  const obj = new ResultWithMostGeodes({ blueprint, maxMinutes: isPartOne ? 25 : 33, handleLogEvent });
  const bestResult = obj.getResult();
  // @ts-ignore
  return bestResult?.resources.geode * blueprint.id;
}

/** @param {SETUP} setup */
/** @param {Function} handleLogEvent */
function placeholder3(setup, handleLogEvent) {
  const results = [];
  const progress = new Helpers.Progress({ handleLogEvent });

  return results;
}

/** @param {SETUP} setup */
/** @param {Function} handleLogEvent * /
function placeholder1(setup, handleLogEvent) {
  const results = [];
  const progress = new Helpers.Progress({ handleLogEvent });

  return results;
}

/**/

module.exports = {
  getSolutionPart1,
  getSolutionPart2,

  parseLinesIntoSetup,
  ResultWithMostGeodes,
  getQualityLevel,
  placeholder3,
};
