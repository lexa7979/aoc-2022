// @ts-check

"use strict";

const Import = require("./index");
// const Helpers = require("./helpers");

const testData1 = [
  //
  "root: pppw + sjmn",
  "dbpl: 5",
  "cczh: sllz + lgvd",
  "zczc: 2",
  "ptdq: humn - dvpt",
  "dvpt: 3",
  "lfqf: 4",
  "humn: 5",
  "ljgn: 2",
  "sjmn: drzm * dbpl",
  "sllz: 4",
  "pppw: cczh / lfqf",
  "lgvd: ljgn * ptdq",
  "drzm: hmdt - zczc",
  "hmdt: 32",
];

const testSetup1 = {
  //
  monkeys: [
    { name: "root", numberToYell: null, leftArgMonkey: "pppw", operation: "+", rightArgMonkey: "sjmn" },
    { name: "dbpl", numberToYell: 5 },
    { name: "cczh", numberToYell: null, leftArgMonkey: "sllz", operation: "+", rightArgMonkey: "lgvd" },
    { name: "zczc", numberToYell: 2 },
    { name: "ptdq", numberToYell: null, leftArgMonkey: "humn", operation: "-", rightArgMonkey: "dvpt" },
    { name: "dvpt", numberToYell: 3 },
    { name: "lfqf", numberToYell: 4 },
    { name: "humn", numberToYell: 5 },
    { name: "ljgn", numberToYell: 2 },
    { name: "sjmn", numberToYell: null, leftArgMonkey: "drzm", operation: "*", rightArgMonkey: "dbpl" },
    { name: "sllz", numberToYell: 4 },
    { name: "pppw", numberToYell: null, leftArgMonkey: "cczh", operation: "/", rightArgMonkey: "lfqf" },
    { name: "lgvd", numberToYell: null, leftArgMonkey: "ljgn", operation: "*", rightArgMonkey: "ptdq" },
    { name: "drzm", numberToYell: null, leftArgMonkey: "hmdt", operation: "-", rightArgMonkey: "zczc" },
    { name: "hmdt", numberToYell: 32 },
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

describe("getRootNumberToYell", () => {
  const { getRootNumberToYell } = Import;
  it("works as expected", () => {
    const result = getRootNumberToYell(testSetup1, null, true);
    expect(result).toEqual(152);
  });
});

describe("getHumanNumberSoThatRootGetsEqualNumbers", () => {
  const { getHumanNumberSoThatRootGetsEqualNumbers } = Import;
  it("works as expected", () => {
    expect(getHumanNumberSoThatRootGetsEqualNumbers(testSetup1)).toBe(301);
  });
});

/**
describe.skip("placeholder", () => {
  const { placeholder } = Import;
  it("works as expected", () => {
    const result = placeholder(testSetup1, console.log);
    expect(result).toMatchInlineSnapshot();
  });
});

 **/

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1(console.log);
    expect(result).toBe(291425799367130);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2(console.log);
    expect(result).toBe(3219579395609);
  });
});
