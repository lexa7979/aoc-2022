// @ts-check

const Import = require("./index");
// const Helpers = require("./helpers");

const testData1 = [
  //
  1, 2, -3, 3, -2, 0, 4,
];

const testSetup1 = {
  //
  numbers: [1, 2, -3, 3, -2, 0, 4],
};

const testSetup2 = {
  numbers: [3, 21, 5, 0, -14, -7, 2, 14, -3, 79],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    // expect(parseLinesIntoSetup(testData1, true)).toMatchInlineSnapshot();
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("remixNumbers", () => {
  const { remixNumbers } = Import;
  it("works as expected", () => {
    const result = remixNumbers(testSetup1, true);
    expect(result).toEqual([-2, 1, 2, -3, 4, 0, 3]);

    expect(remixNumbers(testSetup2, true)).toEqual([0, 14, 3, 21, 5, -3, -7, 79, 2, -14]);

    expect(remixNumbers(testSetup1, false)).toEqual([
      -2434767459, 1623178306, 3246356612, -1623178306, 2434767459, 811589153, 0,
    ]);
  });
});

describe("getGroveCoordinates", () => {
  const { getGroveCoordinates } = Import;
  it("works as expected", () => {
    const numbers = Import.remixNumbers(testSetup1, true);
    const result = getGroveCoordinates(numbers);
    expect(result).toEqual([4, -3, 2]);
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
    expect(result).not.toBe(-7223);
    expect(result).not.toBe(-1475);
    expect(result).not.toBe(-3381);
    expect(result).toBe(8721);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(831878881825);
  });
});
