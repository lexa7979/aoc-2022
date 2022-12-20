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

  const progress = new Helpers.Progress({ handleLogEvent }).init(setup.blueprints.length);

  const qualityLevels = setup.blueprints.map((blueprint, index) => {
    progress.step(index);
    const result = new ResultWithMostGeodes({ blueprint }).getResult(24);
    return (result.availableResources.geode || 0) * blueprint.id;
  });

  progress.finalize();

  return qualityLevels.reduce((acc, curr) => acc + curr, 0);
}

function getSolutionPart2(handleLogEvent) {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);

  const progress = new Helpers.Progress({ handleLogEvent }).init(3);

  const numberOfGeodesByBlueprint = setup.blueprints.slice(0, 3).map((blueprint, index) => {
    progress.step(index);
    const result = new ResultWithMostGeodes({ blueprint }).getResult(32);
    return result.availableResources.geode || 0;
  });

  progress.finalize();

  return numberOfGeodesByBlueprint.reduce((acc, curr) => acc * curr, 1);
}

const ORE = "ore";
const CLAY = "clay";
const OBSIDIAN = "obsidian";
const GEODE = "geode";
const RESOURCE_TYPES = [ORE, CLAY, OBSIDIAN, GEODE];
const EMPTY_RESOURCES = Object.freeze({ ore: 0, clay: 0, obsidian: 0, geode: 0 });

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
  /** @param {{ blueprint: object }} inputBag */
  constructor({ blueprint }) {
    /** @type {BLUEPRINT} */
    this.blueprint = blueprint;

    /** @type {{ ore: RESOURCES, clay: RESOURCES, obsidian: RESOURCES, geode: RESOURCES }} */ // @ts-ignore
    this.costsByRobotType = RESOURCE_TYPES.reduce((acc, currType) => {
      acc[currType] = this.blueprint[`${currType}RobotCost`];
      return acc;
    }, {});

    /** @type {number} */
    this.maxNumberOfOreRobotsNeeded = Math.max(
      this.costsByRobotType.clay.ore || 0,
      this.costsByRobotType.obsidian.ore || 0,
      this.costsByRobotType.geode.ore || 0
    );
  }

  /** @param {number} maxMinutes */
  getResult(maxMinutes) {
    /** @type {{ robotsByMinute: Array<string | null>, availableResources: RESOURCES }} */
    const bestResult = { robotsByMinute: [], availableResources: { ...EMPTY_RESOURCES } };

    /** @param {Array<string | null>} robotsByMinute */
    /** @param {RESOURCES} availableResources */
    const _memorizeResult = (robotsByMinute, availableResources) => {
      for (let i = 0; i < 4; i++) {
        const type = [GEODE, OBSIDIAN, CLAY, ORE][i];
        if (bestResult.availableResources[type] > availableResources[type]) {
          return;
        }
        if (bestResult.availableResources[type] < availableResources[type]) {
          break;
        }
      }
      bestResult.robotsByMinute = robotsByMinute;
      bestResult.availableResources = availableResources;
    };

    /** @param {Array<string | null>} robotsByMinute */
    /** @param {string} nextRobotTypeToBuild */
    const _recursion = (robotsByMinute, nextRobotTypeToBuild) => {
      const robotCountByType = { ...EMPTY_RESOURCES };
      robotsByMinute.filter(Boolean).forEach(type => {
        robotCountByType[type]++;
      });

      if (
        robotCountByType.ore > this.maxNumberOfOreRobotsNeeded ||
        (nextRobotTypeToBuild === OBSIDIAN && robotCountByType.clay === 0) ||
        (nextRobotTypeToBuild === GEODE && robotCountByType.obsidian === 0)
      ) {
        return;
      }

      const minute = robotsByMinute.length;
      const remainingMinutes = maxMinutes - minute;

      const producedResources = this._getProducedResources(robotsByMinute, minute);
      const availableResources = this._getDecreasedResources({
        currResources: producedResources,
        changes: this._getConsumedResources(robotsByMinute),
      });

      if (minute > maxMinutes) {
        _memorizeResult(robotsByMinute, availableResources);
        return;
      }

      const optimisticMaximumOfGeodesToProduceUntilTheEnd = Helpers.getArrayRange(0, remainingMinutes).reduce(
        (acc, minutesAfterNow) => acc + robotCountByType.geode + minutesAfterNow,
        producedResources.geode || 0
      );
      // @ts-ignore
      if (optimisticMaximumOfGeodesToProduceUntilTheEnd < bestResult.availableResources.geode) {
        return;
      }

      const canBuildRobotNow = this._areFewerOrSameResources(
        this.costsByRobotType[nextRobotTypeToBuild],
        availableResources
      );
      if (canBuildRobotNow) {
        RESOURCE_TYPES.forEach(newRobotType => _recursion([...robotsByMinute, nextRobotTypeToBuild], newRobotType));
      } else {
        _recursion([...robotsByMinute, null], nextRobotTypeToBuild);
      }
    };

    _recursion([ORE], ORE);
    _recursion([ORE], CLAY);

    return bestResult;
  }

  /** @param {Array<string | null>} robotsByMinute */
  /** @param {number} minute */
  _getProducedResources(robotsByMinute, minute) {
    /** @type {RESOURCES} */
    const result = { ...EMPTY_RESOURCES };
    robotsByMinute.forEach((robotType, buildMinute) => {
      if (robotType != null && buildMinute < minute && result[robotType] != null) {
        result[robotType] += minute - buildMinute - 1;
      }
    });
    return result;
  }

  /** @param {Array<string | null>} robotsByMinute */
  _getConsumedResources(robotsByMinute) {
    /** @type {RESOURCES} */
    const result = { ...EMPTY_RESOURCES };
    robotsByMinute.forEach((robotType, buildMinute) => {
      if (robotType != null && buildMinute > 0) {
        RESOURCE_TYPES.forEach(type => {
          result[type] += this.costsByRobotType[robotType][type] || 0;
        });
      }
    });
    return result;
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

  /** @param {RESOURCES} fewer */
  /** @param {RESOURCES} more */
  _areFewerOrSameResources(fewer, more) {
    return RESOURCE_TYPES.every(type => !fewer[type] || fewer[type] <= more[type]);
  }
}

/** @param {SETUP} setup */
/** @param {Function} handleLogEvent * /
function placeholder1(setup, handleLogEvent) {
  const results = [];
  const progress = new Helpers.Progress({ handleLogEvent }).init(79);

  return results;
}

/**/

module.exports = {
  getSolutionPart1,
  getSolutionPart2,

  parseLinesIntoSetup,
  ResultWithMostGeodes,
};
