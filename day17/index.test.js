// @ts-check

const Import = require("./index");
// const Helpers = require("./helpers");

const testData1 = [
  //
  ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>",
];

const testSetup1 = {
  //
  movements: [
    1, 1, 1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, -1, -1, -1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1, 1, 1,
    -1, 1, 1, -1, -1, 1, 1,
  ],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    // expect(parseLinesIntoSetup(testData1, true)).toMatchInlineSnapshot();
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("playTetris", () => {
  const { playTetris } = Import;
  it("works as expected with some stones", () => {
    expect(playTetris(testSetup1, 2)).toEqual([
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 2, y: 2 },
      { x: 4, y: 2 },
    ]);
  });

  it("works as expected with many stones", () => {
    const result2 = playTetris(testSetup1, 2022);
    const highestFallenStoneY = result2.reduce((acc, { y }) => Math.max(acc, y), 0) + 1;
    const lowestFallenStoneY = result2.reduce((acc, { y }) => Math.min(acc, y), Number.MAX_VALUE) + 1;
    expect(highestFallenStoneY).toBe(3068);
    expect(lowestFallenStoneY).toBe(3036);
  });

  it("works as expected with extremly many stones", () => {
    const result2 = playTetris(testSetup1, 1000000000000);
    const highestFallenStoneY = result2.reduce((acc, { y }) => Math.max(acc, y), 0) + 1;
    expect(highestFallenStoneY).toBe(1514285714288);
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
    expect(result).toBe(3119);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(1536994219669);
  });
});
