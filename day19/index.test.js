// @ts-check

const Import = require("./index");
const Helpers = require("./helpers");

const testData1 = [
  //
  "Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.",
  "Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.",
];

const testSetup1 = {
  //
  blueprints: [
    {
      id: 1,
      oreRobotCost: { ore: 4 },
      clayRobotCost: { ore: 2 },
      obsidianRobotCost: { clay: 14, ore: 3 },
      geodeRobotCost: { obsidian: 7, ore: 2 },
    },
    {
      id: 2,
      oreRobotCost: { ore: 2 },
      clayRobotCost: { ore: 3 },
      obsidianRobotCost: { clay: 8, ore: 3 },
      geodeRobotCost: { obsidian: 12, ore: 3 },
    },
  ],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    // expect(parseLinesIntoSetup(testData1, true)).toMatchInlineSnapshot();
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);

    const lines = Helpers.parseInputData();
    const setup = parseLinesIntoSetup(lines, true);
    expect(setup.blueprints.slice(0, 5)).toEqual([
      {
        id: 1,
        oreRobotCost: { ore: 4 },
        clayRobotCost: { ore: 4 },
        obsidianRobotCost: { clay: 5, ore: 4 },
        geodeRobotCost: { obsidian: 7, ore: 3 },
      },
      {
        id: 2,
        oreRobotCost: { ore: 4 },
        clayRobotCost: { ore: 4 },
        obsidianRobotCost: { clay: 15, ore: 4 },
        geodeRobotCost: { obsidian: 17, ore: 4 },
      },
      {
        id: 3,
        oreRobotCost: { ore: 4 },
        clayRobotCost: { ore: 4 },
        obsidianRobotCost: { clay: 9, ore: 2 },
        geodeRobotCost: { obsidian: 15, ore: 3 },
      },
      {
        id: 4,
        oreRobotCost: { ore: 4 },
        clayRobotCost: { ore: 4 },
        obsidianRobotCost: { clay: 8, ore: 2 },
        geodeRobotCost: { obsidian: 9, ore: 3 },
      },
      {
        id: 5,
        oreRobotCost: { ore: 3 },
        clayRobotCost: { ore: 3 },
        obsidianRobotCost: { clay: 19, ore: 2 },
        geodeRobotCost: { obsidian: 12, ore: 2 },
      },
    ]);
  });
});

describe("ResultWithMostGeodes", () => {
  const { ResultWithMostGeodes } = Import;
  it("has expected internal helpers", () => {
    const blueprint = testSetup1.blueprints[0];
    const currResources = { ore: 4, obsidian: 1 };

    const obj = new ResultWithMostGeodes({ blueprint });
    expect(obj.costsByRobotType).toEqual({
      clay: { ore: 2 },
      geode: { obsidian: 7, ore: 2 },
      obsidian: { clay: 14, ore: 3 },
      ore: { ore: 4 },
    });

    expect(obj._getIncreasedResources({ currResources, changes: { ore: 8, clay: 5 } })).toEqual({
      clay: 5,
      geode: 0,
      obsidian: 1,
      ore: 12,
    });

    expect(obj._checkIfIsEnoughResourcesToBuild({ currResources, robotType: "ore" })).toBe(true);
    expect(obj._checkIfIsEnoughResourcesToBuild({ currResources, robotType: "clay" })).toBe(true);
    expect(obj._checkIfIsEnoughResourcesToBuild({ currResources, robotType: "obsidian" })).toBe(false);
    expect(obj._checkIfIsEnoughResourcesToBuild({ currResources, robotType: "geode" })).toBe(false);

    obj.bestResult = {
      resources: {},
      robots: {},
      buildMinuteOfFirstRobots: { ore: 1, clay: 4, obsidian: 11 },
    };
    expect(
      obj._checkIfIsBadResultAlready({
        minute: 14,
        buildMinuteOfFirstRobots: { ore: 1, clay: 3, obsidian: 11 },
      })
    ).toBe(false);
  });

  it.only("works as expected", () => {
    const obj = new ResultWithMostGeodes({
      blueprint: testSetup1.blueprints[0],
      maxMinutes: 33,
      handleLogEvent: console.log,
    });

    expect(obj.getResult()).toEqual({
      buildMinuteOfFirstRobots: {
        clay: 3,
        geode: 18,
        obsidian: 11,
        ore: 1,
      },
      resources: {
        clay: 41,
        geode: 9,
        obsidian: 8,
        ore: 6,
      },
      robots: {
        clay: 4,
        geode: 2,
        obsidian: 2,
        ore: 1,
      },
    });
  });
});

// describe.skip("getResultWithMostGeodes", () => {
//   const { getResultWithMostGeodes } = Import;
//   it("works as expected", () => {
//     const result = getResultWithMostGeodes(testSetup1.blueprints[0], console.log);
//     expect(result).toMatchInlineSnapshot(`
// {
//   "id": 1,
//   "resources": {
//     "clay": 20,
//     "geode": 0,
//     "obsidian": 0,
//     "ore": 1,
//   },
//   "robots": {
//     "clay": 1,
//     "ore": 1,
//   },
// }
// `);
//   });
// });

// describe.skip("yieldRobotBuildDecisions", () => {
//   const { yieldRobotBuildDecisions } = Import;
//   it("works as expected", () => {
//     const result = [];
//     const _yield = data => {
//       result.push(data);
//     };
//     yieldRobotBuildDecisions(5, _yield, console.log);

//     expect(result).toHaveLength(3125);
//     expect(result.slice(0, 5)).toMatchInlineSnapshot();
//   });
// });

describe.skip("getQualityLevel", () => {
  const { getQualityLevel } = Import;
  it("works as expected", () => {
    expect(getQualityLevel(testSetup1.blueprints[0], console.log)).toBe(9);
    expect(getQualityLevel(testSetup1.blueprints[1], console.log)).toBe(24);
  });
});

describe.skip("placeholder3", () => {
  const { placeholder3 } = Import;
  it("works as expected", () => {
    const result = placeholder3(testSetup1, console.log);
    expect(result).toMatchInlineSnapshot();
  });
});

/**
describe.skip("placeholder", () => {
  const { placeholder } = Import;
  it("works as expected", () => {
    const result = placeholder(testSetup1, console.log);
    expect(result).toMatchInlineSnapshot();
  });
});

 **/

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it.skip("- when used with real data - works as expected", () => {
    // took 9300 s...
    const result = getSolutionPart1(console.log);
    expect(result).not.toBe(1704);
    expect(result).toBe(1981);
  });

  it.skip("- when using parts of the real data - works as epxected", () => {
    const lines = Helpers.parseInputData();
    const setup = Import.parseLinesIntoSetup(lines, true);

    setup.blueprints.splice(1);

    const progress = new Helpers.Progress({ handleLogEvent: console.log });
    progress.init(setup.blueprints.length);

    const qualityLevels = setup.blueprints.map((blueprint, index) => {
      progress.step(index);
      return Import.getQualityLevel(blueprint, console.log, true);
    });

    progress.finalize();

    const result = qualityLevels.reduce((acc, curr) => acc + curr, 0);

    expect(qualityLevels).toEqual([8, 0, 3, 16, 0]);
    expect(result).toBe(27);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it.skip("- when used with real data - works as expected", () => {
    const result = getSolutionPart2(console.log);
    expect(result).toBe(2534);
  });

  it.only("- when using parts of the real data - works as epxected", () => {
    const lines = Helpers.parseInputData();
    const setup = Import.parseLinesIntoSetup(lines, false);

    setup.blueprints.splice(3);

    const progress = new Helpers.Progress({ handleLogEvent: console.log });
    progress.init(setup.blueprints.length);

    const qualityLevels = setup.blueprints.map((blueprint, index) => {
      progress.step(index);
      return Import.getQualityLevel(blueprint, console.log, false);
    });

    progress.finalize();

    const result = qualityLevels.reduce((acc, curr) => acc + curr, 0);

    expect(qualityLevels).toEqual([8, 0, 3,]);
    expect(result).toBe(27);
  });
});
