// @ts-check

"use strict";

const Import = require("./index");
// const Helpers = require("./helpers");

const testData1 = [
  //
  "1=-0-2",
  "12111",
  "2=0=",
  "21",
  "2=01",
  "111",
  "20012",
  "112",
  "1=-1=",
  "1-12",
  "12",
  "1=",
  "122",
];

const testSetup1 = {
  snafuNumbers: [
    //
    "1=-0-2",
    "12111",
    "2=0=",
    "21",
    "2=01",
    "111",
    "20012",
    "112",
    "1=-1=",
    "1-12",
    "12",
    "1=",
    "122",
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

describe("mapIntoDecimals", () => {
  const { mapIntoDecimals } = Import;
  it("works as expected", () => {
    const result = mapIntoDecimals(testSetup1, console.log);
    expect(result).toEqual([1747, 906, 198, 11, 201, 31, 1257, 32, 353, 107, 7, 3, 37]);
  });
});

describe("getSnafu", () => {
  const { getSnafu } = Import;
  it("works as expected", () => {
    const result = getSnafu(4890);
    expect(result).toBe("2=-1=0");
  });
});

/** /
describe.skip("placeholder", () => {
  const { placeholder } = Import;
  it("works as expected", () => {
    const result = placeholder(testSetup1, console.log);
    expect(result).toMatchInlineSnapshot();
  });
});

/**/

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1(console.log);
    expect(result).toBe("2=2-1-010==-0-1-=--2");
  });
});

describe.skip("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2(console.log);
    expect(result).toBe(839);
  });
});
