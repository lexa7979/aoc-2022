// @ts-check

const Import = require("./index");

const testData1 = [
  //
  "[1,1,3,1,1]",
  "[1,1,5,1,1]",
  "",
  "[[1],[2,3,4]]",
  "[[1],4]",
  "",
  "[9]",
  "[[8,7,6]]",
  "",
  "[[4,4],4,4]",
  "[[4,4],4,4,4]",
  "",
  "[7,7,7,7]",
  "[7,7,7]",
  "",
  "[]",
  "[3]",
  "",
  "[[[]]]",
  "[[]]",
  "",
  "[1,[2,[3,[4,[5,6,7]]]],8,9]",
  "[1,[2,[3,[4,[5,6,0]]]],8,9]",
];

const testSetup1 = {
  //
  pairs: [
    ["[1,1,3,1,1]", "[1,1,5,1,1]"],
    ["[[1],[2,3,4]]", "[[1],4]"],
    ["[9]", "[[8,7,6]]"],
    ["[[4,4],4,4]", "[[4,4],4,4,4]"],
    ["[7,7,7,7]", "[7,7,7]"],
    ["[]", "[3]"],
    ["[[[]]]", "[[]]"],
    ["[1,[2,[3,[4,[5,6,7]]]],8,9]", "[1,[2,[3,[4,[5,6,0]]]],8,9]"],
  ],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("decideIfItemsAreInCorrectOrder", () => {
  const { decideIfItemsAreInCorrectOrder } = Import;
  it("works as expected", () => {
    // const result1 = decideIfItemsAreInCorrectOrder({ pairs: [testSetup1.pairs[6]] });
    // expect(result1).toEqual([false]);
    const result = decideIfItemsAreInCorrectOrder(testSetup1);
    expect(result).toEqual([true, true, false, true, false, true, false, false]);
  });
});

describe("parseList", () => {
  const { parseList } = Import;
  it("works as expected", () => {
    expect(parseList(testSetup1.pairs[0][0])).toEqual([
      { level: 1, value: 1 },
      { level: 1, value: 1 },
      { level: 1, value: 3 },
      { level: 1, value: 1 },
      { level: 1, value: 1 },
      { level: 1, value: "EOL" },
    ]);
    //
    expect(parseList(testSetup1.pairs[1][0])).toEqual([
      { level: 2, value: 1 },
      { level: 2, value: "EOL" },
      { level: 2, value: 2 },
      { level: 2, value: 3 },
      { level: 2, value: 4 },
      { level: 2, value: "EOL" },
      { level: 1, value: "EOL" },
    ]);
    expect(parseList(testSetup1.pairs[1][1])).toEqual([
      { level: 2, value: 1 },
      { level: 2, value: "EOL" },
      { level: 1, value: 4 },
      { level: 1, value: "EOL" },
    ]);
    //
    expect(parseList(testSetup1.pairs[2][0])).toEqual([
      { level: 1, value: 9 },
      { level: 1, value: "EOL" },
    ]);
    expect(parseList(testSetup1.pairs[2][1])).toEqual([
      { level: 2, value: 8 },
      { level: 2, value: 7 },
      { level: 2, value: 6 },
      { level: 2, value: "EOL" },
      { level: 1, value: "EOL" },
    ]);
    //
    expect(parseList(testSetup1.pairs[6][0])).toEqual([
      { level: 3, value: "EOL" },
      { level: 2, value: "EOL" },
      { level: 1, value: "EOL" },
    ]);
    expect(parseList(testSetup1.pairs[6][1])).toEqual([
      { level: 2, value: "EOL" },
      { level: 1, value: "EOL" },
    ]);
  });
});

describe("sortCompletePacketListIncludingDividers", () => {
  const { sortCompletePacketListIncludingDividers } = Import;
  it("works as expected", () => {
    const result = sortCompletePacketListIncludingDividers(testSetup1);
    expect(result).toEqual([
      "[]",
      "[[]]",
      "[[[]]]",
      "[1,1,3,1,1]",
      "[1,1,5,1,1]",
      "[[1],[2,3,4]]",
      "[1,[2,[3,[4,[5,6,0]]]],8,9]",
      "[1,[2,[3,[4,[5,6,7]]]],8,9]",
      "[[1],4]",
      "[[2]]",
      "[3]",
      "[[4,4],4,4]",
      "[[4,4],4,4,4]",
      "[[6]]",
      "[7,7,7]",
      "[7,7,7,7]",
      "[[8,7,6]]",
      "[9]",
    ]);
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
    expect(result).not.toBe(6155);
    expect(result).not.toBe(5618);
    expect(result).not.toBe(4589);
    expect(result).not.toBe(6239);
    expect(result).toBe(6272);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(22288);
  });
});
