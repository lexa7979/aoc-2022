// @ts-check

const Import = require("./index");

const testData1 = [
  //
  "$ cd /",
  "$ ls",
  "dir a",
  "14848514 b.txt",
  "8504156 c.dat",
  "dir d",
  "$ cd a",
  "$ ls",
  "dir e",
  "29116 f",
  "2557 g",
  "62596 h.lst",
  "$ cd e",
  "$ ls",
  "584 i",
  "$ cd ..",
  "$ cd ..",
  "$ cd d",
  "$ ls",
  "4060174 j",
  "8033020 d.log",
  "5626152 d.ext",
  "7214296 k",
];

const testSetup1 = {
  files: [
    { name: "b.txt", path: "", size: 14848514 },
    { name: "c.dat", path: "", size: 8504156 },
    { name: "f", path: "a", size: 29116 },
    { name: "g", path: "a", size: 2557 },
    { name: "h.lst", path: "a", size: 62596 },
    { name: "i", path: "a/e", size: 584 },
    { name: "j", path: "d", size: 4060174 },
    { name: "d.log", path: "d", size: 8033020 },
    { name: "d.ext", path: "d", size: 5626152 },
    { name: "k", path: "d", size: 7214296 },
  ],
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("calculateDirectorySizes", () => {
  const { calculateDirectorySizes } = Import;
  it("works as expected", () => {
    const setup = JSON.parse(JSON.stringify(testSetup1));
    const result = calculateDirectorySizes(setup);
    expect(result).toEqual({
      "": 48381165,
      a: 94853,
      "a/e": 584,
      d: 24933642,
    });
  });
});

describe("getSmallDirectories", () => {
  const { getSmallDirectories } = Import;
  it("works as expected", () => {
    const directorySizes = Import.calculateDirectorySizes(testSetup1);
    const result = getSmallDirectories(directorySizes);
    expect(result).toEqual([
      { path: "a", totalSize: 94853 },
      { path: "a/e", totalSize: 584 },
    ]);
  });
});

describe("getSizeOfSmallestDirectoryToReleaseEnoughDiscspace", () => {
  const { getSizeOfSmallestDirectoryToReleaseEnoughDiscspace } = Import;
  it("works as expected", () => {
    const directorySizes = Import.calculateDirectorySizes(testSetup1);
    const result = getSizeOfSmallestDirectoryToReleaseEnoughDiscspace(directorySizes);
    expect(result).toBe(24933642);
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
    expect(result).not.toBe(201510112);
    expect(result).toBe(1886043);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(3842121);
  });
});
