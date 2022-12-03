// @ts-check

const Import = require("./index");

const testData1 = [
  //
  "vJrwpWtwJgWrhcsFMMfFFhFp",
  "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
  "PmmdzqPrVvPwwTWBwg",
  "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
  "ttgJtRGJQctTZtZT",
  "CrZsJsPPZsGzwwsLwLmpwMDw",
];

const testSetup1 = {
  rucksacks: [
    ["vJrwpWtwJgWr", "hcsFMMfFFhFp"],
    ["jqHRNqRjqzjGDLGL", "rsFMfFZSrLrFZsSL"],
    ["PmmdzqPrV", "vPwwTWBwg"],
    ["wMqvLMZHhHMvwLH", "jbvcjnnSBnvTQFn"],
    ["ttgJtRGJ", "QctTZtZT"],
    ["CrZsJsPPZsGz", "wwsLwLmpwMDw"],
  ],
};

const testSetup2 = {
  groups: [
    ["vJrwpWtwJgWrhcsFMMfFFhFp", "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL", "PmmdzqPrVvPwwTWBwg"],
    ["wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn", "ttgJtRGJQctTZtZT", "CrZsJsPPZsGzwwsLwLmpwMDw"],
  ],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup2);
  });
});

describe("getDoubleItems", () => {
  const { getDoubleItems } = Import;
  it("works as expected", () => {
    expect(getDoubleItems(testSetup1)).toEqual(["p", "L", "P", "v", "t", "s"]);
  });
});

describe("getItemPriorities", () => {
  const { getItemPriorities } = Import;
  it("works as expected", () => {
    expect(getItemPriorities(["p", "L", "P", "v", "t", "s"])).toEqual([16, 38, 42, 22, 20, 19]);
  });
});

describe("getCommonItemFromEveryGroup", () => {
  const { getCommonItemFromEveryGroup } = Import;
  it("works as expected", () => {
    expect(getCommonItemFromEveryGroup(testSetup2)).toEqual(["r", "Z"]);
  });
});

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1();
    expect(result).toBe(7872);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(2497);
  });
});
