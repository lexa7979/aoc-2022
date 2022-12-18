// @ts-check

const Import = require("./index");
// const Helpers = require("./helpers");

const testData1 = [
  //
  [2, 2, 2],
  [1, 2, 2],
  [3, 2, 2],
  [2, 1, 2],
  [2, 3, 2],
  [2, 2, 1],
  [2, 2, 3],
  [2, 2, 4],
  [2, 2, 6],
  [1, 2, 5],
  [3, 2, 5],
  [2, 1, 5],
  [2, 3, 5],
];

const testSetup1 = {
  //
  cubes: [
    { x: 2, y: 2, z: 2 },
    { x: 1, y: 2, z: 2 },
    { x: 3, y: 2, z: 2 },
    { x: 2, y: 1, z: 2 },
    { x: 2, y: 3, z: 2 },
    { x: 2, y: 2, z: 1 },
    { x: 2, y: 2, z: 3 },
    { x: 2, y: 2, z: 4 },
    { x: 2, y: 2, z: 6 },
    { x: 1, y: 2, z: 5 },
    { x: 3, y: 2, z: 5 },
    { x: 2, y: 1, z: 5 },
    { x: 2, y: 3, z: 5 },
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

describe("countExposedCubeSides", () => {
  const { countExposedCubeSides } = Import;
  it("works as expected", () => {
    expect(
      countExposedCubeSides({
        cubes: [
          { x: 1, y: 1, z: 1 },
          { x: 2, y: 1, z: 1 },
        ],
      })
    ).toBe(10);

    const result = countExposedCubeSides(testSetup1);
    expect(result).toBe(64);
  });
});

describe("fillBigCubeAroundLavaDropletWithoutRecursion", () => {
  const { fillBigCubeAroundLavaDropletWithoutRecursion } = Import;
  it("works as expected", () => {
    const outsideCubes = fillBigCubeAroundLavaDropletWithoutRecursion(testSetup1);
    expect(outsideCubes).toHaveLength(186);
    expect(outsideCubes.slice(0, 5)).toEqual([
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 2 },
    ]);
  });
});

describe("countCubeSidesExposedToOutsideCubes", () => {
  const { countCubeSidesExposedToOutsideCubes } = Import;
  it("works as expected", () => {
    const outsideCubes = Import.fillBigCubeAroundLavaDropletWithoutRecursion(testSetup1);
    const result = countCubeSidesExposedToOutsideCubes(testSetup1, outsideCubes);
    expect(result).toEqual(58);
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
    expect(result).toBe(4390);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).not.toBe(4168);
    expect(result).not.toBe(4066);
    expect(result).not.toBe(4084);
    expect(result).toBe(2534);
  });
});
