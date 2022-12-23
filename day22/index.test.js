// @ts-check

"use strict";

const Import = require("./index");
// const Helpers = require("./helpers");

const testData1 = [
  //
  "        ...#",
  "        .#..",
  "        #...",
  "        ....",
  "...#.......#",
  "........#...",
  "..#....#....",
  "..........#.",
  "        ...#....",
  "        .....#..",
  "        .#......",
  "        ......#.",
  "",
  "10R5L5R10L4R5L5",
];

const testSetup1 = {
  //
  map: {
    groundYX: {
      1: [9, 10, 11],
      2: [9, 11, 12],
      3: [10, 11, 12],
      4: [9, 10, 11, 12],
      5: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11],
      6: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12],
      7: [1, 2, 4, 5, 6, 7, 9, 10, 11, 12],
      8: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
      9: [9, 10, 11, 13, 14, 15, 16],
      10: [9, 10, 11, 12, 13, 15, 16],
      11: [9, 11, 12, 13, 14, 15, 16],
      12: [9, 10, 11, 12, 13, 14, 16],
    },
    stonesYX: {
      1: [12],
      2: [10],
      3: [9],
      5: [4, 12],
      6: [9],
      7: [3, 8],
      8: [11],
      9: [12],
      10: [14],
      11: [10],
      12: [15],
    },
  },
  movements: [10, "R", 5, "L", 5, "R", 10, "L", 4, "R", 5, "L", 5],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    // expect(parseLinesIntoSetup(testData1, true)).toMatchInlineSnapshot();
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("followPath", () => {
  const { followPath } = Import;
  it("works as expected", () => {
    const result = followPath(testSetup1, null);
    expect(result).toEqual({ pos: { x: 8, y: 6 }, dir: "+x" });
  });
});

describe("getPassword", () => {
  const { getPassword } = Import;
  it("works as expected", () => {
    const result = getPassword(testSetup1, null, true);
    expect(result).toBe(6032);

    const result2 = getPassword(testSetup1, null, false);
    expect(result2).toBe(5031);
  });
});

describe("mapSetupOntoCube", () => {
  const { mapSetupOntoCube } = Import;
  it("works as expected", () => {
    const result = mapSetupOntoCube(testSetup1);
    expect(result).toEqual({
      dimension: 4,
      type: "example",
      max: { x: 16, y: 12 },
      start: { x: 9, y: 1 },
      sidesOfCube: {
        top: { start: { x: 9, y: 1 }, end: { x: 12, y: 4 } },
        front: { start: { x: 9, y: 5 }, end: { x: 12, y: 8 } },
        bottom: { start: { x: 9, y: 9 }, end: { x: 12, y: 12 } },
        back: { start: { x: 1, y: 5 }, end: { x: 4, y: 8 } },
        left: { start: { x: 5, y: 5 }, end: { x: 8, y: 8 } },
        right: { start: { x: 13, y: 9 }, end: { x: 16, y: 12 } },
      },
    });
  });
});

describe("followPathOnCube", () => {
  const { followPathOnCube } = Import;
  it("works as expected", () => {
    const cubeSetup = Import.mapSetupOntoCube(testSetup1);
    const result = followPathOnCube(testSetup1, cubeSetup, console.log);
    expect(result).toEqual({ pos: { x: 7, y: 5 }, dir: "-y" });
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
    const result = getSolutionPart1(null);
    expect(result).toBe(181128);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2(console.log);
    expect(result).toBe(52311);
  });
});
