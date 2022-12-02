const Helpers = require("./helpers");

describe.skip("getArrayRange", () => {
  const { getArrayRange } = Helpers;
  it("works as expected", () => {
    expect(getArrayRange(3, 6)).toEqual([3, 4, 5, 6]);
    expect(getArrayRange(7, 6)).toEqual([7, 6]);
    expect(getArrayRange(5, 5)).toEqual([5]);
  });
});

describe.skip("parseInputData", () => {
  const { parseInputData, setParseOptions } = Helpers;

  it("- when not using transformMatch and asInteger - works as expected", () => {
    setParseOptions({ transformMatch: null, asInteger: false });
    const result = parseInputData(["forward 12", "up 7"]);
    expect(result).toEqual(["forward 12", "up 7"]);
  });

  it("- when not using transformMatch, but asInteger - works as expected", () => {
    setParseOptions({ transformMatch: null, asInteger: true });
    const result = parseInputData(["12", "7"]);
    expect(result).toEqual([12, 7]);
  });

  it("- when using transformMatch and asInteger - works as expected", () => {
    setParseOptions({ transformMatch: /^(\d+),(\d+)$/, asInteger: true });
    const result = parseInputData(["79,12", "54,7"]);
    expect(result).toEqual([
      [79, 12],
      [54, 7],
    ]);
  });

  it("- when using transformMatch and asInteger is an array - works as expected", () => {
    setParseOptions({ transformMatch: /^(\w+) (\d+)$/, asInteger: [2] });
    const result = parseInputData(["forward 12", "up 7"]);
    expect(result).toEqual([
      ["forward", 12],
      ["up", 7],
    ]);
  });

  it("- when using transformMatch - FAILS if matching fails", () => {
    setParseOptions({ transformMatch: /^(\w+) (\d+)$/, asInteger: false });
    expect(() => parseInputData(["forward 12", "up 7", "down w/o number"])).toThrow("Failed to parse line");
  });
});

describe.skip("getNthPermutationOfElements", () => {
  const { getNthPermutationOfElements } = Helpers;

  it("- when used with an array of three numbers - works as expected", () => {
    const elements = [1, 2, 3];

    const results = [];
    for (let n = 0; ; n++) {
      const permutation = getNthPermutationOfElements(n, elements);
      if (permutation) {
        results.push(permutation);
      } else {
        break;
      }
    }

    expect(results.length).toBe(3 * 2 * 1);
    expect(results).toEqual([
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1],
    ]);
  });

  it("- when used with an array of four letters - works as expected", () => {
    const elements = ["l", "e", "x", "A"];

    const results = [];
    for (let n = 0; ; n++) {
      const permutation = getNthPermutationOfElements(n, elements);
      if (permutation) {
        results.push(permutation);
      } else {
        break;
      }
    }

    expect(results.length).toBe(4 * 3 * 2 * 1);
    expect(results).toEqual([
      ["l", "e", "x", "A"],
      ["l", "e", "A", "x"],
      ["l", "x", "e", "A"],
      ["l", "x", "A", "e"],
      ["l", "A", "e", "x"],
      ["l", "A", "x", "e"],
      ["e", "l", "x", "A"],
      ["e", "l", "A", "x"],
      ["e", "x", "l", "A"],
      ["e", "x", "A", "l"],
      ["e", "A", "l", "x"],
      ["e", "A", "x", "l"],
      ["x", "l", "e", "A"],
      ["x", "l", "A", "e"],
      ["x", "e", "l", "A"],
      ["x", "e", "A", "l"],
      ["x", "A", "l", "e"],
      ["x", "A", "e", "l"],
      ["A", "l", "e", "x"],
      ["A", "l", "x", "e"],
      ["A", "e", "l", "x"],
      ["A", "e", "x", "l"],
      ["A", "x", "l", "e"],
      ["A", "x", "e", "l"],
    ]);
  });
});
