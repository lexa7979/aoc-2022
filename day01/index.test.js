// @ts-check

const Import = require("./index");

const testData1 = [
  //
  "1000",
  "2000",
  "3000",
  "",
  "4000",
  "",
  "5000",
  "6000",
  "",
  "7000",
  "8000",
  "9000",
  "",
  "10000",
];

const testSetup1 = {
  singleCaloriesByElves: [[1000, 2000, 3000], [4000], [5000, 6000], [7000, 8000, 9000], [10000]],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    const setup = parseLinesIntoSetup(testData1);
    expect(setup).toEqual(testSetup1);
  });
});

describe("calculateTotalCaloriesByElf", () => {
  const { calculateTotalCaloriesByElf } = Import;
  it("works as expected", () => {
    const result = calculateTotalCaloriesByElf(testSetup1);
    expect(result).toEqual([6000, 4000, 11000, 24000, 10000]);
    expect(Math.max(...result)).toEqual(24000);
  });
});

describe("getCaloriesOfTop3Elves", () => {
  const { getCaloriesOfTop3Elves } = Import;
  it("works as expected", () => {
    const result = getCaloriesOfTop3Elves(testSetup1);
    expect(result).toEqual([10000, 11000, 24000]);
    expect(result.reduce((acc, curr) => acc + curr, 0)).toBe(45000);
  });
});

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1();
    expect(result).toBe(67633);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(199628);
  });
});
