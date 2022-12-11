// @ts-check

const Import = require("./index");

const testData1 = [
  //
  "Monkey 0:",
  "  Starting items: 79, 98",
  "  Operation: new = old * 19",
  "  Test: divisible by 23",
  "    If true: throw to monkey 2",
  "    If false: throw to monkey 3",
  "",
  "Monkey 1:",
  "  Starting items: 54, 65, 75, 74",
  "  Operation: new = old + 6",
  "  Test: divisible by 19",
  "    If true: throw to monkey 2",
  "    If false: throw to monkey 0",
  "",
  "Monkey 2:",
  "  Starting items: 79, 60, 97",
  "  Operation: new = old * old",
  "  Test: divisible by 13",
  "    If true: throw to monkey 1",
  "    If false: throw to monkey 3",
  "",
  "Monkey 3:",
  "  Starting items: 74",
  "  Operation: new = old + 3",
  "  Test: divisible by 17",
  "    If true: throw to monkey 0",
  "    If false: throw to monkey 1",
];

const testSetup1 = {
  monkeys: [
    {
      id: 0,
      operation: ["*", 19],
      startingItems: [79, 98],
      test: { divisibleBy: 23, ifFalseThrowToMonkey: 3, ifTrueThrowToMonkey: 2 },
    },
    {
      id: 1,
      operation: ["+", 6],
      startingItems: [54, 65, 75, 74],
      test: { divisibleBy: 19, ifFalseThrowToMonkey: 0, ifTrueThrowToMonkey: 2 },
    },
    {
      id: 2,
      operation: ["*", "old"],
      startingItems: [79, 60, 97],
      test: { divisibleBy: 13, ifFalseThrowToMonkey: 3, ifTrueThrowToMonkey: 1 },
    },
    {
      id: 3,
      operation: ["+", 3],
      startingItems: [74],
      test: { divisibleBy: 17, ifFalseThrowToMonkey: 1, ifTrueThrowToMonkey: 0 },
    },
  ],
  dividers: [23, 19, 13, 17],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("playSeveralRounds", () => {
  const { playSeveralRounds } = Import;
  it("works as expected", () => {
    const result = playSeveralRounds(testSetup1, 20, true);
    expect(result[19]).toEqual({
      inspectCountByMonkey: {
        0: 101,
        1: 95,
        2: 7,
        3: 105,
      },
      itemsByMonkey: {
        0: [10, 12, 14, 26, 34],
        1: [245, 93, 53, 199, 115],
        2: [],
        3: [],
      },
    });

    const result2 = playSeveralRounds(testSetup1, 20, false);
    expect(result2[19]).toEqual({
      inspectCountByMonkey: {
        0: 99,
        1: 97,
        2: 8,
        3: 103,
      },
      itemsByMonkey: {
        0: [7723, 61208, 82089, 95446, 84350],
        1: [84591, 55901, 10567, 20200, 60575],
        2: [],
        3: [],
      },
    });
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
    expect(result).toBe(119715);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).not.toBe(32348900163);
    expect(result).toBe(18085004878);
  });
});
