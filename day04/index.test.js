// @ts-check

const Import = require("./index");

const testData1 = [
  //
  [2, 4, 6, 8],
  [2, 3, 4, 5],
  [5, 7, 7, 9],
  [2, 8, 3, 7],
  [6, 6, 4, 6],
  [2, 6, 4, 8],
];

const testSetup1 = {
  assignmentPairs: [
    [
      [2, 3, 4],
      [6, 7, 8],
    ],
    [
      [2, 3],
      [4, 5],
    ],
    [
      [5, 6, 7],
      [7, 8, 9],
    ],
    [
      [2, 3, 4, 5, 6, 7, 8],
      [3, 4, 5, 6, 7],
    ],
    [[6], [4, 5, 6]],
    [
      [2, 3, 4, 5, 6],
      [4, 5, 6, 7, 8],
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

describe("decideIfOneAssignmentFullyContainsTheOther", () => {
  const { decideIfOneAssignmentFullyContainsTheOther } = Import;
  it("works as expected", () => {
    expect(decideIfOneAssignmentFullyContainsTheOther(testSetup1)).toEqual([false, false, false, true, true, false]);
  });
});

describe("decideIfOneAssignmentPartlyContainsTheOther", () => {
  const { decideIfOneAssignmentPartlyContainsTheOther } = Import;
  it("works as expected", () => {
    expect(decideIfOneAssignmentPartlyContainsTheOther(testSetup1)).toEqual([false, false, true, true, true, true]);
  });
});

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1();
    expect(result).toBe(453);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(919);
  });
});
