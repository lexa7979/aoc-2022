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

  it.skip("works as expected", () => {
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

  it.skip("has _findFastestWayToProduceOneObsidianRobot which works as expected", () => {
    const blueprint = testSetup1.blueprints[0];
    const obj = new ResultWithMostGeodes({ blueprint });
    const result1 = obj._findFastestWayToProduceOneObsidianRobot({});
    const result2 = obj._findFastestWayToProduceOneObsidianRobot({ firstSimpleRobotsToBuild: ["ore", "ore"] });
    const result3 = obj._findFastestWayToProduceOneObsidianRobot({ firstSimpleRobotsToBuild: ["clay", "ore"] });
    expect(result1).toEqual({
      minute: 11,
      producedResources: { clay: 15, ore: 10 },
      robots: [
        { buildMinute: 3, robotType: "clay" },
        { buildMinute: 5, robotType: "clay" },
        { buildMinute: 7, robotType: "clay" },
      ],
    });
    expect(result2).toEqual({
      minute: 15,
      producedResources: { clay: 14, ore: 30 },
      robots: [
        { buildMinute: 5, robotType: "ore" },
        { buildMinute: 8, robotType: "ore" },
        { buildMinute: 9, robotType: "clay" },
        { buildMinute: 10, robotType: "clay" },
        { buildMinute: 11, robotType: "clay" },
        { buildMinute: 12, robotType: "clay" },
        { buildMinute: 13, robotType: "ore" },
      ],
    });
    expect(result3).toEqual({
      minute: 13,
      producedResources: { clay: 15, ore: 17 },
      robots: [
        { buildMinute: 3, robotType: "clay" },
        { buildMinute: 7, robotType: "ore" },
        { buildMinute: 9, robotType: "clay" },
        { buildMinute: 10, robotType: "clay" },
        { buildMinute: 11, robotType: "clay" },
      ],
    });
  });

  it.skip("has _findFastestWayToProduceOneGeodeRobot which works as expected", () => {
    const blueprint = testSetup1.blueprints[0];
    const obj = new ResultWithMostGeodes({ blueprint });
    expect(obj._findFastestWayToProduceOneGeodeRobot({})).toEqual({
      minute: 18,
      producedResources: { clay: 41, geode: 0, obsidian: 8, ore: 17 },
      robots: [
        { buildMinute: 3, robotType: "clay" },
        { buildMinute: 5, robotType: "clay" },
        { buildMinute: 7, robotType: "clay" },
        { buildMinute: 11, robotType: "obsidian" },
        { buildMinute: 12, robotType: "clay" },
        { buildMinute: 15, robotType: "obsidian" },
      ],
    });

    expect(
      obj._findFastestWayToProduceOneGeodeRobot({
        firstSimpleRobotsToBuild: ["ore", "ore"],
      })
    ).toEqual({
      minute: 21,
      producedResources: { clay: 44, geode: 0, obsidian: 7, ore: 62 },
      robots: [
        { buildMinute: 5, robotType: "ore" },
        { buildMinute: 8, robotType: "ore" },
        { buildMinute: 9, robotType: "clay" },
        { buildMinute: 10, robotType: "clay" },
        { buildMinute: 11, robotType: "clay" },
        { buildMinute: 12, robotType: "clay" },
        { buildMinute: 13, robotType: "ore" },
        { buildMinute: 14, robotType: "clay" },
        { buildMinute: 15, robotType: "obsidian" },
        { buildMinute: 16, robotType: "ore" },
        { buildMinute: 17, robotType: "ore" },
        { buildMinute: 18, robotType: "obsidian" },
        { buildMinute: 19, robotType: "ore" },
      ],
    });
  });

  it.skip("has _getResult2 which works as expected", () => {
    const blueprint = testSetup1.blueprints[0];
    const obj = new ResultWithMostGeodes({ blueprint });
    expect(obj._getResult2(33)).toMatchInlineSnapshot(`
{
  "producedResources": {
    "clay": 104,
    "geode": 31,
    "obsidian": 52,
    "ore": 146,
  },
  "robots": [
    {
      "buildMinute": 5,
      "robotType": "ore",
    },
    {
      "buildMinute": 8,
      "robotType": "ore",
    },
    {
      "buildMinute": 9,
      "robotType": "clay",
    },
    {
      "buildMinute": 10,
      "robotType": "clay",
    },
    {
      "buildMinute": 11,
      "robotType": "clay",
    },
    {
      "buildMinute": 12,
      "robotType": "clay",
    },
    {
      "buildMinute": 13,
      "robotType": "ore",
    },
    {
      "buildMinute": 14,
      "robotType": "clay",
    },
    {
      "buildMinute": 15,
      "robotType": "obsidian",
    },
    {
      "buildMinute": 16,
      "robotType": "ore",
    },
    {
      "buildMinute": 17,
      "robotType": "ore",
    },
    {
      "buildMinute": 18,
      "robotType": "obsidian",
    },
    {
      "buildMinute": 19,
      "robotType": "ore",
    },
    {
      "buildMinute": 21,
      "robotType": "geode",
    },
    {
      "buildMinute": 22,
      "robotType": "obsidian",
    },
    {
      "buildMinute": 24,
      "robotType": "obsidian",
    },
    {
      "buildMinute": 25,
      "robotType": "geode",
    },
    {
      "buildMinute": 26,
      "robotType": "geode",
    },
    {
      "buildMinute": 28,
      "robotType": "geode",
    },
    {
      "buildMinute": 29,
      "robotType": "obsidian",
    },
    {
      "buildMinute": 30,
      "robotType": "geode",
    },
    {
      "buildMinute": 31,
      "robotType": "geode",
    },
  ],
}
`);
  });

  it("has _getResult3 which works as expected", () => {
    const blueprint = testSetup1.blueprints[0];
    const obj = new ResultWithMostGeodes({ blueprint });

    const robotsByMinute = [
      "ore",
      ...[null, null, "clay", null, "clay"],
      ...[null, "clay", null, null, null],
      ...["obsidian", "clay", null, null, "obsidian"],
      ...[null, null, "geode", null, null],
      ...["geode", null, null, null],
    ];

    expect(obj._getProducedResources3(robotsByMinute, 5)).toEqual({ ore: 4, clay: 1, obsidian: 0, geode: 0 });
    expect(obj._getProducedResources3(robotsByMinute, 10)).toEqual({ ore: 9, clay: 12, obsidian: 0, geode: 0 });
    expect(obj._getProducedResources3(robotsByMinute, 25)).toEqual({ ore: 24, clay: 69, obsidian: 22, geode: 9 });

    expect(obj._getConsumedResources3(robotsByMinute.slice(10))).toEqual({ ore: 12, clay: 28, obsidian: 14, geode: 0 });
    expect(obj._getConsumedResources3(robotsByMinute)).toEqual({ ore: 18, clay: 28, obsidian: 14, geode: 0 });

    expect(
      obj._getDecreasedResources({
        currResources: obj._getProducedResources3(robotsByMinute, 25),
        changes: obj._getConsumedResources3(robotsByMinute),
      })
    ).toEqual({ ore: 6, clay: 41, obsidian: 8, geode: 9 });

    expect(obj._getMaxCostsByResourceType()).toEqual({ ore: 4, clay: 14, obsidian: 7, geode: 0 });

    expect(obj._getResult3(24).availableResources).toEqual({
      clay: 27,
      geode: 9,
      obsidian: 10,
      ore: 3,
    });
    expect(obj._getResult3(32).availableResources).toEqual({
      clay: 70,
      geode: 56,
      obsidian: 14,
      ore: 5,
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

describe.skip("getSolutionPart1", () => {
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
  it.only("- when used with real data - works as expected", () => {
    const result = getSolutionPart2(console.log);
    expect(result).not.toBe(139);
    expect(result).toBe(10962);
  });
});
