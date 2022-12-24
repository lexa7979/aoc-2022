// @ts-check

"use strict";

const Import = require("./index");
const Helpers = require("./helpers");

const testData1 = [
  //
  "#.######",
  "#>>.<^<#",
  "#.<..<<#",
  "#>v.><>#",
  "#<^v^^>#",
  "######.#",
];

const testSetup1 = {
  //
  blizzards: [
    { dir: "east", pos: { x: 1, y: 1 } },
    { dir: "east", pos: { x: 2, y: 1 } },
    { dir: "west", pos: { x: 4, y: 1 } },
    { dir: "north", pos: { x: 5, y: 1 } },
    { dir: "west", pos: { x: 6, y: 1 } },
    { dir: "west", pos: { x: 2, y: 2 } },
    { dir: "west", pos: { x: 5, y: 2 } },
    { dir: "west", pos: { x: 6, y: 2 } },
    { dir: "east", pos: { x: 1, y: 3 } },
    { dir: "south", pos: { x: 2, y: 3 } },
    { dir: "east", pos: { x: 4, y: 3 } },
    { dir: "west", pos: { x: 5, y: 3 } },
    { dir: "east", pos: { x: 6, y: 3 } },
    { dir: "west", pos: { x: 1, y: 4 } },
    { dir: "north", pos: { x: 2, y: 4 } },
    { dir: "south", pos: { x: 3, y: 4 } },
    { dir: "north", pos: { x: 4, y: 4 } },
    { dir: "north", pos: { x: 5, y: 4 } },
    { dir: "east", pos: { x: 6, y: 4 } },
  ],
  bottomRight: { x: 6, y: 4 },
  finish: { x: 6, y: 5 },
  start: { x: 1, y: 0 },
  topLeft: { x: 1, y: 1 },
  size: { x: 6, y: 4 },
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    // expect(parseLinesIntoSetup(testData1, true)).toMatchInlineSnapshot();
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("hasBlizzard", () => {
  const { hasBlizzard } = Import;
  it("wors as expected", () => {
    const blizzards1 = [];
    for (let y = testSetup1.topLeft.y; y <= testSetup1.bottomRight.y; y++) {
      for (let x = testSetup1.topLeft.x; x <= testSetup1.bottomRight.x; x++) {
        // @ts-ignore
        if (hasBlizzard({ setup: testSetup1, pos: { x, y }, minute: 4 })) {
          blizzards1.push({ x, y });
        }
      }
    }

    expect(Helpers.paintCoordinates({ list: blizzards1, format: "{x,y}", yAxisGoesDown: true })).toEqual([
      "s.....",
      ".#####",
      "..##.#",
      ".####.",
      "...##.",
    ]);
  });
});

describe("findShortestWayBFS", () => {
  const { findShortestWayBFS } = Import;
  it("works as expected", () => {
    expect(
      findShortestWayBFS({
        // @ts-ignore
        setup: testSetup1,
        maxMinute: 100,
        isPartOne: true,
        handleLogEvent: console.log,
      })
    ).toEqual(18);

    expect(
      findShortestWayBFS({
        // @ts-ignore
        setup: testSetup1,
        maxMinute: 100,
        isPartOne: false,
        handleLogEvent: console.log,
      })
    ).toEqual(54);
  });
});

/** /
describe.skip("placeholder", () => {
  const { placeholder } = Import;
  it("works as expected", () => {
    const result = placeholder(testSetup1, console.log);
    expect(result).toMatchInlineSnapshot();
  });
});

/**/

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1(console.log);
    expect(result).toBe(274);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2(console.log);
    expect(result).toBe(839);
  });
});
