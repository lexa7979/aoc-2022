// @ts-check

const Import = require("./index");

const testData1 = [
  //
  "    [D]",
  "[N] [C]",
  "[Z] [M] [P]",
  " 1   2   3",
  "",
  "move 1 from 2 to 1",
  "move 3 from 1 to 3",
  "move 2 from 2 to 1",
  "move 1 from 1 to 2",
];

const testSetup1 = {
  rearrangements: [
    {
      from: 2,
      move: 1,
      to: 1,
    },
    {
      from: 1,
      move: 3,
      to: 3,
    },
    {
      from: 2,
      move: 2,
      to: 1,
    },
    {
      from: 1,
      move: 1,
      to: 2,
    },
  ],
  stacks: [["Z", "N"], ["M", "C", "D"], ["P"], [], [], [], [], [], [], []],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

/**
describe("placeholder", () => {
  const { placeholder } = Import;
  it("works as expected", () => {
    const result = placeholder(testSetup1);
    expect(result).toMatchInlineSnapshot();
  });
});
 **/

describe("runRearrangements", () => {
  const { runRearrangements } = Import;
  it("works as expected", () => {
    const setup = JSON.parse(JSON.stringify(testSetup1));
    const { stacks } = runRearrangements(setup);
    expect(stacks).toEqual([["C"], ["M"], ["P", "D", "N", "Z"], [], [], [], [], [], [], []]);
    const solution = stacks
      .map(list => list.pop())
      .filter(Boolean)
      .join("");
    expect(solution).toBe("CMZ");
  });
});

describe("runAlternativeRearrangements", () => {
  const { runAlternativeRearrangements } = Import;
  it("works as expected", () => {
    const setup = JSON.parse(JSON.stringify(testSetup1));
    const { stacks } = runAlternativeRearrangements(setup);
    expect(stacks).toEqual([["M"], ["C"], ["P", "Z", "N", "D"], [], [], [], [], [], [], []]);
    const solution = stacks
      .map(list => list.pop())
      .filter(Boolean)
      .join("");
    expect(solution).toBe("MCD");
  });
});

describe("getSolutionPart1", () => {
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1();
    expect(result).not.toBe("SVZCCBWN");
    expect(result).toBe("ZSQVCCJLL");
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe("QZFJRWHGS");
  });
});
