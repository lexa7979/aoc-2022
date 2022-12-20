// @ts-check

const Import = require("./index");
// const Helpers = require("./helpers");

const testData1 = [
  //
];

const testSetup1 = {
  //
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    // expect(parseLinesIntoSetup(testData1, true)).toMatchInlineSnapshot();
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe.skip("placeholder1", () => {
  const { placeholder1 } = Import;
  it("works as expected", () => {
    const result = placeholder1(testSetup1, console.log);
    expect(result).toMatchInlineSnapshot();
  });
});

describe.skip("placeholder2", () => {
  const { placeholder2 } = Import;
  it("works as expected", () => {
    const result = placeholder2(testSetup1, console.log);
    expect(result).toMatchInlineSnapshot();
  });
});

describe.skip("placeholder3", () => {
  const { placeholder3 } = Import;
  it("works as expected", () => {
    const result = placeholder3(testSetup1, console.log);
    expect(result).toMatchInlineSnapshot();
  });
});

/**
describe.skip("placeholder1", () => {
  const { placeholder1 } = Import;
  it("works as expected", () => {
    const result = placeholder1(testSetup1, console.log);
    expect(result).toMatchInlineSnapshot();
  });
});

 **/

describe.skip("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1(console.log);
    expect(result).toBe(8721);
  });
});

describe.skip("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2(console.log);
    expect(result).toBe(831878881825);
  });
});
