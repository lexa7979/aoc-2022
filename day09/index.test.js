// @ts-check

const Import = require("./index");

const testData1 = [
  //
  ["R", 4],
  ["U", 4],
  ["L", 3],
  ["D", 1],
  ["R", 4],
  ["D", 1],
  ["L", 5],
  ["R", 2],
];

const testSetup1 = {
  movements: [
    { direction: "right", steps: 4 },
    { direction: "up", steps: 4 },
    { direction: "left", steps: 3 },
    { direction: "down", steps: 1 },
    { direction: "right", steps: 4 },
    { direction: "down", steps: 1 },
    { direction: "left", steps: 5 },
    { direction: "right", steps: 2 },
  ],
};

const testSetup2 = {
  movements: [
    { direction: "right", steps: 5 },
    { direction: "up", steps: 8 },
    { direction: "left", steps: 8 },
    { direction: "down", steps: 3 },
    { direction: "right", steps: 17 },
    { direction: "down", steps: 10 },
    { direction: "left", steps: 25 },
    { direction: "up", steps: 20 },
  ],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("simulateMovementsOfTail", () => {
  const { simulateMovementsOfTail } = Import;
  it("works as expected", () => {
    const result = simulateMovementsOfTail(testSetup1);
    expect(result).toEqual([
      "0;0",
      "1;0",
      "2;0",
      "3;0",
      "3;0",
      "4;1",
      "4;2",
      "4;3",
      "4;3",
      "3;4",
      "2;4",
      "2;4",
      "2;4",
      "2;4",
      "3;3",
      "4;3",
      "4;3",
      "4;3",
      "4;3",
      "3;2",
      "2;2",
      "1;2",
      "1;2",
      "1;2",
    ]);
    const positions = result.filter((item, index) => result.indexOf(item) === index);
    expect(positions.length).toBe(13);
  });
});

describe("simulateMovementsOfTenKnots", () => {
  const { simulateMovementsOfTenKnots } = Import;
  it("works as expected", () => {
    const positions = simulateMovementsOfTenKnots(testSetup2);
    const uniquePositions = positions.filter((item, index) => positions.indexOf(item) === index);
    expect(uniquePositions).toHaveLength(36);
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
    expect(result).toBe(6498);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(2531);
  });
});
