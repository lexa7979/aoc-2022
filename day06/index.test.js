// @ts-check

const Import = require("./index");

const testData1 = [
  //
  "mjqjpqmgbljsphdztnvjfqwrcgsmlb",
];

const testSetup1 = {
  text: "mjqjpqmgbljsphdztnvjfqwrcgsmlb",
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("getFirstPositionAfterFourUniqueCharacters", () => {
  const { getFirstPositionAfterFourUniqueCharacters } = Import;
  it("works as expected", () => {
    const setup = JSON.parse(JSON.stringify(testSetup1));
    const result = getFirstPositionAfterFourUniqueCharacters(setup);
    expect(result).toEqual(7);
  });
});

describe("getFirstPositionAfterFourteenUniqueCharacters", () => {
  const { getFirstPositionAfterFourteenUniqueCharacters } = Import;
  it("works as expected", () => {
    const setup = JSON.parse(JSON.stringify(testSetup1));
    const result = getFirstPositionAfterFourteenUniqueCharacters(setup);
    expect(result).toEqual(19);
  });
});

/**
describe.skip("placeholder", () => {
  const { placeholder } = Import;
  it("works as expected", () => {
    const setup = JSON.parse(JSON.stringify(testSetup1));
    const result = placeholder(setup);
    expect(result).toMatchInlineSnapshot();
  });
});
 **/

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1();
    expect(result).toBe(1542);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(3153);
  });
});
