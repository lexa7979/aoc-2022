// @ts-check

const Import = require("./index");

const testData1 = [
  //
  "Sabqponm",
  "abcryxxl",
  "accszExk",
  "acctuvwj",
  "abdefghi",
];

const testSetup1 = {
  //
  area: [
    [0, 0, 1, 16, 15, 14, 13, 12],
    [0, 1, 2, 17, 24, 23, 23, 11],
    [0, 2, 2, 18, 25, 25, 23, 10],
    [0, 2, 2, 19, 20, 21, 22, 9],
    [0, 1, 3, 4, 5, 6, 7, 8],
  ],
  bestSignalPos: {
    x: 5,
    y: 2,
  },
  currPos: {
    x: 0,
    y: 0,
  },
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("getFewestStepsWithDijkstra", () => {
  const { getFewestStepsWithDijkstra } = Import;
  it("works as expected", () => {
    const result = getFewestStepsWithDijkstra(testSetup1);
    expect(result).toBe(31);
  });
});

describe("listStartPositions", () => {
  const { listStartPositions } = Import;
  it("works as expected", () => {
    const result = listStartPositions(testSetup1);
    expect(result).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 0, y: 4 },
    ]);
  });
});

describe("getFewestStepsFromDifferentStartPositions", () => {
  const { getFewestStepsFromDifferentStartPositions } = Import;
  it("works as expected", () => {
    const result = getFewestStepsFromDifferentStartPositions(testSetup1);
    expect(result).toBe(29);
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
    expect(result).toBe(462);
  });
});

describe.skip("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).not.toBe(430);
    expect(result).not.toBe(280);
    expect(result).not.toBe(192);
    expect(result).toBe(451);
  });
});
