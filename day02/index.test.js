// @ts-check

const Import = require("./index");

const testData1 = [
  //
  ["A", "Y"],
  ["B", "X"],
  ["C", "Z"],
];

const testSetup1 = {
  rounds: [
    ["rock", "paper"],
    ["paper", "rock"],
    ["scissors", "scissors"],
  ],
};

const testSetup2 = {
  rounds: [
    ["rock", "rock"],
    ["paper", "rock"],
    ["scissors", "rock"],
  ],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup2);
  });
});

describe("calculateOutcomeOfRounds", () => {
  const { calculateOutcomeOfRounds } = Import;
  it("works as expected", () => {
    expect(calculateOutcomeOfRounds(testSetup1)).toEqual([8, 1, 6]);
    expect(calculateOutcomeOfRounds(testSetup2)).toEqual([4, 1, 7]);
  });
});

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1();
    expect(result).toBe(9177);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(12111);
  });
});
