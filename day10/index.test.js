// @ts-check

const Import = require("./index");

const testData1 = [
  //
  ["noop"],
  ["addx", 3],
  ["addx", -5],
];

const testSetup1 = {
  commands: [
    //
    { command: "noop" },
    { command: "addx", value: 3 },
    { command: "addx", value: -5 },
  ],
};

const testData2 = [
  //
  ["addx", 15],
  ["addx", -11],
  ["addx", 6],
  ["addx", -3],
  ["addx", 5],
  ["addx", -1],
  ["addx", -8],
  ["addx", 13],
  ["addx", 4],
  ["noop"],
  ["addx", -1],
  ["addx", 5],
  ["addx", -1],
  ["addx", 5],
  ["addx", -1],
  ["addx", 5],
  ["addx", -1],
  ["addx", 5],
  ["addx", -1],
  ["addx", -35],
  ["addx", 1],
  ["addx", 24],
  ["addx", -19],
  ["addx", 1],
  ["addx", 16],
  ["addx", -11],
  ["noop"],
  ["noop"],
  ["addx", 21],
  ["addx", -15],
  ["noop"],
  ["noop"],
  ["addx", -3],
  ["addx", 9],
  ["addx", 1],
  ["addx", -3],
  ["addx", 8],
  ["addx", 1],
  ["addx", 5],
  ["noop"],
  ["noop"],
  ["noop"],
  ["noop"],
  ["noop"],
  ["addx", -36],
  ["noop"],
  ["addx", 1],
  ["addx", 7],
  ["noop"],
  ["noop"],
  ["noop"],
  ["addx", 2],
  ["addx", 6],
  ["noop"],
  ["noop"],
  ["noop"],
  ["noop"],
  ["noop"],
  ["addx", 1],
  ["noop"],
  ["noop"],
  ["addx", 7],
  ["addx", 1],
  ["noop"],
  ["addx", -13],
  ["addx", 13],
  ["addx", 7],
  ["noop"],
  ["addx", 1],
  ["addx", -33],
  ["noop"],
  ["noop"],
  ["noop"],
  ["addx", 2],
  ["noop"],
  ["noop"],
  ["noop"],
  ["addx", 8],
  ["noop"],
  ["addx", -1],
  ["addx", 2],
  ["addx", 1],
  ["noop"],
  ["addx", 17],
  ["addx", -9],
  ["addx", 1],
  ["addx", 1],
  ["addx", -3],
  ["addx", 11],
  ["noop"],
  ["noop"],
  ["addx", 1],
  ["noop"],
  ["addx", 1],
  ["noop"],
  ["noop"],
  ["addx", -13],
  ["addx", -19],
  ["addx", 1],
  ["addx", 3],
  ["addx", 26],
  ["addx", -30],
  ["addx", 12],
  ["addx", -1],
  ["addx", 3],
  ["addx", 1],
  ["noop"],
  ["noop"],
  ["noop"],
  ["addx", -9],
  ["addx", 18],
  ["addx", 1],
  ["addx", 2],
  ["noop"],
  ["noop"],
  ["addx", 9],
  ["noop"],
  ["noop"],
  ["noop"],
  ["addx", -1],
  ["addx", 2],
  ["addx", -37],
  ["addx", 1],
  ["addx", 3],
  ["noop"],
  ["addx", 15],
  ["addx", -21],
  ["addx", 22],
  ["addx", -6],
  ["addx", 1],
  ["noop"],
  ["addx", 2],
  ["addx", 1],
  ["noop"],
  ["addx", -10],
  ["noop"],
  ["noop"],
  ["addx", 20],
  ["addx", 1],
  ["addx", 2],
  ["addx", 2],
  ["addx", -6],
  ["addx", -11],
  ["noop"],
  ["noop"],
  ["noop"],
];

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("runProgram", () => {
  const { runProgram } = Import;
  it("works as expected", () => {
    const result = runProgram(testSetup1);
    expect(result).toEqual([1, 1, 1, 4, 4]);
  });
});

describe("listInterestingSignalsStrengths", () => {
  const { listInterestingSignalsStrengths } = Import;
  it("works as expected", () => {
    const setup = Import.parseLinesIntoSetup(testData2);
    const states = Import.runProgram(setup);
    const result = listInterestingSignalsStrengths(states);
    expect(result).toEqual([420, 1140, 1800, 2940, 2880, 3960]);
  });
});

describe("getScreen", () => {
  const { getScreen } = Import;
  it("works as expected", () => {
    const setup = Import.parseLinesIntoSetup(testData2);
    const states = Import.runProgram(setup);
    const result = getScreen(states);
    expect(result).toEqual([
      "##..##..##..##..##..##..##..##..##..##..",
      "###...###...###...###...###...###...###.",
      "####....####....####....####....####....",
      "#####.....#####.....#####.....#####.....",
      "######......######......######......####",
      "#######.......#######.......#######.....",
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
    expect(result).not.toBe(16120);
    expect(result).toBe(14520);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toEqual([
      "###..####.###...##..####.####...##.###..",
      "#..#....#.#..#.#..#....#.#.......#.#..#.",
      "#..#...#..###..#......#..###.....#.###..",
      "###...#...#..#.#.##..#...#.......#.#..#.",
      "#....#....#..#.#..#.#....#....#..#.#..#.",
      "#....####.###...###.####.####..##..###..",
    ]);
  });
});
