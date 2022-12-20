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

  const progress = new Helpers.Progress({ handleLogEvent });
  progress.init(3);

  const numberOfGeodesByBlueprint = setup.blueprints.slice(0, 3).map((blueprint, index) => {
    progress.step(index);
    const obj = new ResultWithMostGeodes({ blueprint });
    const result = obj._getResult3(32);
    return result.availableResources.geode;
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

/**
 * @typedef LATER_ACTIVATED_ROBOTS
 * @property {string} robotType
 * @property {number} buildMinute
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

    /** @type {{ ore: RESOURCES, clay: RESOURCES, obsidian: RESOURCES, geode: RESOURCES }} */
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
    return RESOURCE_TYPES.every(type => !newResources[type] || newResources[type] <= oldResources[type]);
  }

  _areMoreOrSameResources({ newResources, oldResources }) {
    return RESOURCE_TYPES.every(type => !oldResources[type] || newResources[type] >= oldResources[type]);
  }

  _areFewerResources(fewer, more) {
    return (
      RESOURCE_TYPES.every(type => (fewer[type] || 0) <= (more[type] || 0)) &&
      RESOURCE_TYPES.some(type => (fewer[type] || 0) < (more[type] || 0))
    );
  }

  /**
   * Second approach...
   */

  /**
   * @param {object} inputBag
   * @param {number} inputBag.minute e.g. 5
   * @param {Array<LATER_ACTIVATED_ROBOTS>} inputBag.robots e.g. [{ robotType: "clay", buildMinute: 2 }]
   *
   * @returns {RESOURCES}
   */
  _getProducedResourcesBeforeMinute({ minute, robots }) {
    /** @type {RESOURCES} */
    const result = { ...EMPTY_RESOURCES };
    result.ore = minute - 1; // first robot
    robots.forEach(({ robotType, buildMinute }) => {
      result[robotType] += minute - buildMinute - 1;
    });
    return result;
  }

  /**
   * @param {object} inputBag
   * @param {Array<LATER_ACTIVATED_ROBOTS>} inputBag.robots
   *
   * @returns
   */
  _getConsumedResources({ robots }) {
    /** @type {RESOURCES} */
    const result = { ...EMPTY_RESOURCES };
    robots.forEach(({ robotType }) => {
      RESOURCE_TYPES.forEach(type => {
        result[type] += this.costsByRobotType[robotType][type] || 0;
      });
    });
    return result;
  }

  _findFastestWayToProduceOneObsidianRobot({ firstSimpleRobotsToBuild = [], maxMinutes = 20 }) {
    const bestResult = {
      minute: maxMinutes,
      robots: [],
      producedResources: { ...EMPTY_RESOURCES },
    };

    const _memorizeResult = ({ minute, robots, producedResources }) => {
      if (bestResult.minute < minute) {
        return;
      }
      if (bestResult.minute === minute && !this._areFewerResources(bestResult.producedResources, producedResources)) {
        return;
      }
      bestResult.minute = minute;
      bestResult.robots = robots;
      bestResult.producedResources = producedResources;
    };

    /**
     * @param {object} inputBag
     * @param {number} [inputBag.minute]
     * @param {Array<LATER_ACTIVATED_ROBOTS>} [inputBag.robots]
     * @param {Array<RESOURCES>} [inputBag.nextRobotsToBuild]
     */
    const _recursion = ({ minute = 1, robots = [], nextRobotsToBuild = [] }) => {
      if (minute > bestResult.minute) {
        return;
      }

      const producedResources = this._getProducedResourcesBeforeMinute({ minute, robots });
      const consumedResources = this._getConsumedResources({ robots });
      const availableResources = this._getDecreasedResources({
        currResources: producedResources,
        changes: consumedResources,
      });

      const canBuildObsidianRobot = this._areLessOrSameResources({
        newResources: this.costsByRobotType.obsidian,
        oldResources: availableResources,
      });
      if (canBuildObsidianRobot) {
        _memorizeResult({ minute, robots, producedResources });
        return;
      }

      _recursion({
        minute: minute + 1,
        robots,
        nextRobotsToBuild,
      });

      const canBuildOreRobot = this._areLessOrSameResources({
        newResources: this.costsByRobotType.ore,
        oldResources: availableResources,
      });
      const canBuildClayRobot = this._areLessOrSameResources({
        newResources: this.costsByRobotType.clay,
        oldResources: availableResources,
      });

      // @ts-ignore
      if (!nextRobotsToBuild[0] || nextRobotsToBuild[0] === ORE) {
        if (canBuildOreRobot) {
          _recursion({
            minute: minute + 1,
            robots: [...robots, { robotType: ORE, buildMinute: minute }],
            nextRobotsToBuild: nextRobotsToBuild.slice(1),
          });
        }
      }

      // @ts-ignore
      if (!nextRobotsToBuild[0] || nextRobotsToBuild[0] === CLAY) {
        if (canBuildClayRobot) {
          _recursion({
            minute: minute + 1,
            robots: [...robots, { robotType: CLAY, buildMinute: minute }],
            nextRobotsToBuild: nextRobotsToBuild.slice(1),
          });
        }
      }
    };

    _recursion({ nextRobotsToBuild: firstSimpleRobotsToBuild });

    this.log.length && this.log.length < 100 && console.log(this.log);

    return bestResult;
  }

  _findFastestWayToProduceOneGeodeRobot({ firstSimpleRobotsToBuild = [], maxMinutes = 33 }) {
    const bestResult = {
      minute: maxMinutes,
      robots: [],
      producedResources: { ...EMPTY_RESOURCES },
    };

    const _memorizeResult = ({ minute, robots, producedResources }) => {
      if (bestResult.minute < minute) {
        return;
      }
      if (bestResult.minute === minute && !this._areFewerResources(bestResult.producedResources, producedResources)) {
        return;
      }
      bestResult.minute = minute;
      bestResult.robots = robots;
      bestResult.producedResources = producedResources;
    };

    /**
     * @param {object} inputBag
     * @param {number} [inputBag.minute]
     * @param {Array<LATER_ACTIVATED_ROBOTS>} [inputBag.robots]
     * @param {Array<RESOURCES>} [inputBag.nextRobotsToBuild]
     */
    const _recursion = ({ minute = 1, robots = [], nextRobotsToBuild = [] }) => {
      if (minute > bestResult.minute) {
        return;
      }
      if (minute > firstObsidianRobot.minute) {
        if (robots.every(({ robotType }) => robotType !== OBSIDIAN)) {
          return;
        }
      }

      const producedResources = this._getProducedResourcesBeforeMinute({ minute, robots });
      const consumedResources = this._getConsumedResources({ robots });
      const availableResources = this._getDecreasedResources({
        currResources: producedResources,
        changes: consumedResources,
      });

      const canBuildOreRobot = this._areLessOrSameResources({
        newResources: this.costsByRobotType.ore,
        oldResources: availableResources,
      });
      const canBuildClayRobot = this._areLessOrSameResources({
        newResources: this.costsByRobotType.clay,
        oldResources: availableResources,
      });
      const canBuildObsidianRobot = this._areLessOrSameResources({
        newResources: this.costsByRobotType.obsidian,
        oldResources: availableResources,
      });
      const canBuildGeodeRobot = this._areLessOrSameResources({
        newResources: this.costsByRobotType.geode,
        oldResources: availableResources,
      });

      if (canBuildGeodeRobot) {
        _memorizeResult({ minute, robots, producedResources });
        return;
      }

      _recursion({
        minute: minute + 1,
        robots,
        nextRobotsToBuild,
      });

      // @ts-ignore
      if (!nextRobotsToBuild[0] || nextRobotsToBuild[0] === ORE) {
        if (canBuildOreRobot) {
          _recursion({
            minute: minute + 1,
            robots: [...robots, { robotType: ORE, buildMinute: minute }],
            nextRobotsToBuild: nextRobotsToBuild.slice(1),
          });
        }
      }

      // @ts-ignore
      if (!nextRobotsToBuild[0] || nextRobotsToBuild[0] === CLAY) {
        if (canBuildClayRobot) {
          _recursion({
            minute: minute + 1,
            robots: [...robots, { robotType: CLAY, buildMinute: minute }],
            nextRobotsToBuild: nextRobotsToBuild.slice(1),
          });
        }
      }

      if (canBuildObsidianRobot) {
        _recursion({
          minute: minute + 1,
          robots: [...robots, { robotType: OBSIDIAN, buildMinute: minute }],
          nextRobotsToBuild,
        });
      }
    };

    const firstObsidianRobot = this._findFastestWayToProduceOneObsidianRobot({ firstSimpleRobotsToBuild, maxMinutes });

    _recursion({ nextRobotsToBuild: firstSimpleRobotsToBuild });

    this.log.length && this.log.length < 100 && console.log(this.log);

    return bestResult;
  }

  _getResult2(maxMinutes) {
    const bestResult = { robots: null, producedResources: { ...EMPTY_RESOURCES } };

    const _memorizeResult = ({ robots, producedResources }) => {
      if (producedResources.geode <= bestResult.producedResources.geode) {
        return;
      }
      bestResult.robots = robots;
      bestResult.producedResources = producedResources;
    };

    /**
     * @typedef LATER_ACTIVATED_ROBOTS
     * @property {string} robotType
     * @property {number} buildMinute
     */

    /**
     * @param {object} inputBag
     * @param {number} inputBag.minute e.g. 5
     * @param {Array<LATER_ACTIVATED_ROBOTS>} inputBag.robots e.g. [{ robotType: "clay", buildMinute: 2 }]
     *
     * @returns {RESOURCES}
     */
    const _getProducedResourcesBeforeMinute = ({ minute, robots }) => {
      /** @type {RESOURCES} */
      const result = { ...EMPTY_RESOURCES };
      result.ore = minute - 1; // first robot
      robots.forEach(({ robotType, buildMinute }) => {
        result[robotType] += minute - buildMinute - 1;
      });
      return result;
    };

    /**
     * @param {object} inputBag
     * @param {Array<LATER_ACTIVATED_ROBOTS>} inputBag.robots
     *
     * @returns
     */
    const _getConsumedResources = ({ robots }) => {
      /** @type {RESOURCES} */
      const result = { ...EMPTY_RESOURCES };
      robots.forEach(({ robotType }) => {
        RESOURCE_TYPES.forEach(type => {
          result[type] += this.costsByRobotType[robotType][type] || 0;
        });
      });
      return result;
    };

    /**
     * @param {object} inputBag
     * @param {number} [inputBag.minute]
     * @param {Array<LATER_ACTIVATED_ROBOTS>} [inputBag.robots]
     */
    const _recursion = ({ minute = 1, robots = [] }) => {
      const producedResources = _getProducedResourcesBeforeMinute({ minute, robots });
      if (minute === maxMinutes) {
        _memorizeResult({ robots, producedResources });
        return;
      }

      const consumedResources = _getConsumedResources({ robots });
      const availableResources = this._getDecreasedResources({
        currResources: producedResources,
        changes: consumedResources,
      });

      const canBuildOreRobot = this._areLessOrSameResources({
        newResources: this.costsByRobotType.ore,
        oldResources: availableResources,
      });
      const canBuildClayRobot = this._areLessOrSameResources({
        newResources: this.costsByRobotType.clay,
        oldResources: availableResources,
      });
      const canBuildObsidianRobot = this._areLessOrSameResources({
        newResources: this.costsByRobotType.obsidian,
        oldResources: availableResources,
      });
      const canBuildGeodeRobot = this._areLessOrSameResources({
        newResources: this.costsByRobotType.geode,
        oldResources: availableResources,
      });

      _recursion({
        minute: minute + 1,
        robots,
      });

      if (canBuildOreRobot) {
        _recursion({
          minute: minute + 1,
          robots: [...robots, { robotType: ORE, buildMinute: minute }],
        });
      }
      if (canBuildClayRobot) {
        _recursion({
          minute: minute + 1,
          robots: [...robots, { robotType: CLAY, buildMinute: minute }],
        });
      }
      if (canBuildObsidianRobot) {
        _recursion({
          minute: minute + 1,
          robots: [...robots, { robotType: OBSIDIAN, buildMinute: minute }],
        });
      }
      if (canBuildGeodeRobot) {
        _recursion({
          minute: minute + 1,
          robots: [...robots, { robotType: GEODE, buildMinute: minute }],
        });
      }
    };

    const firstGeodeRobot = this._findFastestWayToProduceOneGeodeRobot({
      firstSimpleRobotsToBuild: ["ore", "ore"],
      maxMinutes,
    });

    const initialRobots = [
      ...(firstGeodeRobot.robots || []),
      { robotType: GEODE, buildMinute: firstGeodeRobot.minute },
    ];

    console.log(firstGeodeRobot);
    console.log(initialRobots);

    _recursion({
      minute: firstGeodeRobot.minute + 1,
      robots: initialRobots,
    });

    this.log.length && this.log.length < 100 && console.log(this.log);

    return bestResult;
  }

  /**
   * Third approach
   */

  /**
   * @param {Array<string | null>} robotsByMinute
   * @param {number} minute
   *
   * @returns {RESOURCES}
   */
  _getProducedResources3(robotsByMinute, minute) {
    /** @type {RESOURCES} */
    const result = { ...EMPTY_RESOURCES };
    robotsByMinute.forEach((robotType, buildMinute) => {
      if (robotType != null && buildMinute < minute && result[robotType] != null) {
        result[robotType] += minute - buildMinute - 1;
      }
    });
    return result;
  }

  /**
   * @param {Array<string | null>} robotsByMinute
   *
   * @returns {RESOURCES}
   */
  _getConsumedResources3(robotsByMinute) {
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

  _getMaxCostsByResourceType() {
    const result = { ...EMPTY_RESOURCES };
    RESOURCE_TYPES.forEach(type => {
      result[type] = Math.max(...Object.values(this.costsByRobotType).map(item => item[type] || 0));
    });
    return result;
  }

  _areFewerOrSameResources3(fewer, more) {
    return RESOURCE_TYPES.every(type => !fewer[type] || fewer[type] <= more[type]);
  }

  _areMoreOrSameResources3(more, fewer) {
    return RESOURCE_TYPES.every(type => !fewer[type] || fewer[type] <= more[type]);
  }

  _areSameResources3(item1, item2) {
    return RESOURCE_TYPES.every(type => (item1[type] || 0) === (item2[type] || 0));
  }

  _getResult3(maxMinutes) {
    const bestResult = {
      robotsByMinute: [],
      availableResources: { ...EMPTY_RESOURCES },
    };

    const log = new Helpers.NoLog();

    const _memorizeResult = (robotsByMinute, availableResources) => {
      let isSameAmountOfResources = true;
      for (let i = 0; i < 4; i++) {
        const type = [GEODE, OBSIDIAN, CLAY, ORE][i];
        if (bestResult.availableResources[type] > availableResources[type]) {
          return;
        }
        if (bestResult.availableResources[type] < availableResources[type]) {
          isSameAmountOfResources = false;
          break;
        }
      }
      // if (isSameAmountOfResources && robotsByMinute.filter(Boolean) > bestResult.robotsByMinute.filter(Boolean)) {
      //   return;
      // }
      bestResult.robotsByMinute = robotsByMinute;
      bestResult.availableResources = availableResources;
    };

    const maxNumberOfOreRobotsNeeded = Math.max(
      this.costsByRobotType.clay.ore || 0,
      this.costsByRobotType.obsidian.ore || 0,
      this.costsByRobotType.geode.ore || 0
    );

    const _canBuildRobotNow = ({ robotType, availableResources }) =>
      this._areFewerOrSameResources3(this.costsByRobotType[robotType], availableResources);

    const _recursion = (robotsByMinute, nextRobotTypeToBuild) => {
      const robotCountByType = { ...EMPTY_RESOURCES };
      robotsByMinute.forEach(type => {
        if (type != null) {
          robotCountByType[type]++;
        }
      });

      if (robotCountByType.ore > maxNumberOfOreRobotsNeeded) {
        return;
      }
      if (nextRobotTypeToBuild === OBSIDIAN && robotCountByType.clay === 0) {
        return;
      }
      if (nextRobotTypeToBuild === GEODE && robotCountByType.obsidian === 0) {
        return;
      }

      const minute = robotsByMinute.length;
      const remainingMinutes = maxMinutes - minute;

      const producedResources = this._getProducedResources3(robotsByMinute, minute);
      const consumedResources = this._getConsumedResources3(robotsByMinute);
      const availableResources = this._getDecreasedResources({
        currResources: producedResources,
        changes: consumedResources,
      });

      if (minute > maxMinutes) {
        _memorizeResult(robotsByMinute, availableResources);
        log.add(robotsByMinute);
        return;
      }

      // let optimisticMaximumOfGeodesToProduceUntilTheEnd =
      //   (producedResources.geode || 0) + robotCountByType.geode * remainingMinutes;
      // for (let k = minute; k < maxMinutes; k++) {
      //   optimisticMaximumOfGeodesToProduceUntilTheEnd += maxMinutes - k;
      // }

      let optimisticMaximumOfGeodesToProduceUntilTheEnd = producedResources.geode || 0;
      for (let k = 0; k <= remainingMinutes; k++) {
        optimisticMaximumOfGeodesToProduceUntilTheEnd += robotCountByType.geode + k;
      }
      if (optimisticMaximumOfGeodesToProduceUntilTheEnd < bestResult.availableResources.geode) {
        return;
      }

      if (_canBuildRobotNow({ robotType: nextRobotTypeToBuild, availableResources })) {
        RESOURCE_TYPES.forEach(newRobotType => _recursion([...robotsByMinute, nextRobotTypeToBuild], newRobotType));
      } else {
        _recursion([...robotsByMinute, null], nextRobotTypeToBuild);
      }
    };

    _recursion([ORE], ORE);
    _recursion([ORE], CLAY);

    log.done();

    return bestResult;
  }
}

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
