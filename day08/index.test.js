// @ts-check

const Import = require("./index");

const testData1 = [
  //
  "30373",
  "25512",
  "65332",
  "33549",
  "35390",
];

const testSetup1 = {
  rows: [
    ["3", "0", "3", "7", "3"],
    ["2", "5", "5", "1", "2"],
    ["6", "5", "3", "3", "2"],
    ["3", "3", "5", "4", "9"],
    ["3", "5", "3", "9", "0"],
  ],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("mapIntoVisibleTrees", () => {
  const { mapIntoVisibleTrees } = Import;
  it("works as expected", () => {
    const setup = JSON.parse(JSON.stringify(testSetup1));
    const result = mapIntoVisibleTrees(setup);
    expect(result).toEqual([
      [true, true, true, true, true],
      [true, true, true, false, true],
      [true, true, false, true, true],
      [true, false, true, false, true],
      [true, true, true, true, true],
    ]);
  });
});

describe("mapIntoScenicScore", () => {
  const { mapIntoScenicScore } = Import;
  it("works as expected", () => {
    const setup = JSON.parse(JSON.stringify(testSetup1));
    const result = mapIntoScenicScore(setup);
    expect(result).toEqual([
      [4, 1, 2, 12, 3],
      [1, 1, 4, 1, 2],
      [16, 6, 1, 2, 1],
      [1, 1, 8, 3, 12],
      [1, 4, 1, 12, 1],
    ]);
  });
});

/**
describe.skip("placeholder", () => {
  const { placeholder } = Import;
  it("works as expected", () => {
    const setup = JSON.parse(JSON.stringify(testSetup1));
    const result = placeholder(setup);
    expect(result).toMatchInlineSnapshot();
  });
});
 **/

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1();
    expect(result).toBe(1543);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(595080);
  });
});
