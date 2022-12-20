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
    const exampleRobots = [
      "ore",
      ...[null, null, "clay", null, "clay", null, "clay", null, null, null],
      ...["obsidian", "clay", null, null, "obsidian", null, null, "geode", null, null],
      ...["geode", null, null, null],
    ];

    const obj = new ResultWithMostGeodes({ blueprint: testSetup1.blueprints[0] });
    expect(obj.costsByRobotType).toEqual({
      clay: { ore: 2 },
      geode: { obsidian: 7, ore: 2 },
      obsidian: { clay: 14, ore: 3 },
      ore: { ore: 4 },
    });
    expect(obj.maxNumberOfOreRobotsNeeded).toBe(3);

    expect(
      obj._getIncreasedResources({
        currResources: { ore: 4, obsidian: 1 },
        changes: { ore: 8, clay: 5 },
      })
    ).toEqual({ ore: 12, clay: 5, obsidian: 1, geode: 0 });

    expect(obj._getProducedResources(exampleRobots, 5)).toEqual({ ore: 4, clay: 1, obsidian: 0, geode: 0 });
    expect(obj._getProducedResources(exampleRobots, 10)).toEqual({ ore: 9, clay: 12, obsidian: 0, geode: 0 });
    expect(obj._getProducedResources(exampleRobots, 25)).toEqual({ ore: 24, clay: 69, obsidian: 22, geode: 9 });

    expect(obj._getConsumedResources(exampleRobots.slice(10))).toEqual({ ore: 12, clay: 28, obsidian: 14, geode: 0 });
    expect(obj._getConsumedResources(exampleRobots)).toEqual({ ore: 18, clay: 28, obsidian: 14, geode: 0 });

    expect(
      obj._getDecreasedResources({
        currResources: obj._getProducedResources(exampleRobots, 25),
        changes: obj._getConsumedResources(exampleRobots),
      })
    ).toEqual({ ore: 6, clay: 41, obsidian: 8, geode: 9 });
  });

  it("has getResult() which works as expected", () => {
    const obj = new ResultWithMostGeodes({ blueprint: testSetup1.blueprints[0] });

    expect(obj.getResult(24).availableResources).toEqual({ ore: 3, clay: 27, obsidian: 10, geode: 9 });
    expect(obj.getResult(32).availableResources).toEqual({ ore: 5, clay: 70, obsidian: 14, geode: 56 });
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
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1(console.log);
    expect(result).not.toBe(1704);
    expect(result).toBe(1981);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2(console.log);
    expect(result).not.toBe(139);
    expect(result).toBe(10962);
  });
});
