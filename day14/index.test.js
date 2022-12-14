// @ts-check

const Import = require("./index");

const testData1 = [
  //
  "498,4 -> 498,6 -> 496,6",
  "503,4 -> 502,4 -> 502,9 -> 494,9",
];

const testSetup1 = {
  //
  rockPaths: [
    [
      { x: -2, y: 4 },
      { x: -2, y: 6 },
      { x: -4, y: 6 },
    ],
    [
      { x: 3, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 9 },
      { x: -6, y: 9 },
    ],
  ],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("mapIntoRocks", () => {
  const { mapIntoRocks } = Import;
  it("works as expected", () => {
    const result = mapIntoRocks(testSetup1);
    expect(result).toEqual({
      4: [-2, 2, 3],
      5: [-2, 2],
      6: [-4, -3, -2, 2],
      7: [2],
      8: [2],
      9: [-6, -5, -4, -3, -2, -1, 0, 1, 2],
    });
  });
});

describe("simulateSand", () => {
  const { simulateSand } = Import;
  it("works as expected", () => {
    const rocks = Import.mapIntoRocks(testSetup1);
    expect(simulateSand(rocks, true)).toEqual({
      2: [0],
      3: [-1, 0, 1],
      4: [-1, 0, 1],
      5: [-3, -1, 0, 1],
      6: [-1, 0, 1],
      7: [-2, -1, 0, 1],
      8: [-5, -3, -2, -1, 0, 1],
    });
    expect(simulateSand(rocks, false)).toEqual({
      0: [0],
      1: [-1, 0, 1],
      10: [-10, -9, -8, -7, -6, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      2: [-2, -1, 0, 1, 2],
      3: [-3, -2, -1, 0, 1, 2, 3],
      4: [-4, -3, -1, 0, 1, 4],
      5: [-5, -4, -3, -1, 0, 1, 3, 4, 5],
      6: [-6, -5, -1, 0, 1, 3, 4, 5, 6],
      7: [-7, -6, -5, -4, -2, -1, 0, 1, 3, 4, 5, 6, 7],
      8: [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 3, 4, 5, 6, 7, 8],
      9: [-9, -8, -7, 3, 4, 5, 6, 7, 8, 9],
    });
  });
});

describe("countSand", () => {
  const { countSand } = Import;
  it("works as expected", () => {
    const rocks = Import.mapIntoRocks(testSetup1);
    const sand = Import.simulateSand(rocks, true);
    const result = countSand(sand);
    expect(result).toEqual(24);
  });
});

/**
describe.skip("placeholder", () => {
  const { placeholder } = Import;
  it("works as expected", () => {
    const result = placeholder(testSetup1);
    expect(result).toMatchInlineSnapshot();
  });
});

 **/

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1();
    expect(result).toBe(614);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(26170);
  });
});
