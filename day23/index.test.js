// @ts-check

"use strict";

const Import = require("./index");
const Helpers = require("./helpers");

const testData1 = [
  //
  "....#..",
  "..###.#",
  "#...#.#",
  ".#...##",
  "#.###..",
  "##.#.##",
  ".#..#..",
];

const testSetup1 = {
  //
  elves: {
    0: [4],
    1: [2, 3, 4, 6],
    2: [0, 4, 6],
    3: [1, 5, 6],
    4: [0, 2, 3, 4],
    5: [0, 1, 3, 5, 6],
    6: [1, 4],
  },
  elvesCount: 22,
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    // expect(parseLinesIntoSetup(testData1, true)).toMatchInlineSnapshot();
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("moveElves", () => {
  const { moveElves } = Import;
  it("works as expected", () => {
    const result = moveElves(testSetup1, 10, console.log);
    expect(result.elves).toEqual({
      "-1": [8],
      "-2": [4],
      0: [-1, 1, 4],
      1: [3],
      2: [0, 6, 9],
      3: [-2, 5, 6],
      4: [2, 3],
      5: [-1, 8],
      6: [1, 3, 6],
      8: [1, 4, 7],
    });
    expect(
      Helpers.paintCoordinates({
        list: result.elves,
        format: "list[-y] === [x1,x2,x3,...]",
      })
    ).toEqual([
      "......#.....",
      "..........#.",
      ".#s#..#.....",
      ".....#......",
      "..#.....#..#",
      "#......##...",
      "....##......",
      ".#........#.",
      "...#.#..#...",
      "............",
      "...#..#..#..",
    ]);

    const { roundCount } = moveElves(testSetup1, Number.MAX_SAFE_INTEGER, console.log);
    expect(roundCount).toBe(20);
  });
});

describe("countEmptyGround", () => {
  const { countEmptyGround } = Import;
  it("works as expected", () => {
    const { elves } = Import.moveElves(testSetup1, 10, console.log);
    const result = countEmptyGround(elves, testSetup1.elvesCount);
    expect(result).toBe(110);
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
    expect(result).toBe(3947);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2(console.log);
    expect(result).not.toBe(1011);
    expect(result).toBe(1012);
  });
});
