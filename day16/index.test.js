// @ts-check

const Import = require("./index");
const Helpers = require("./helpers");

const testData1 = [
  //
  "Valve AA has flow rate=0; tunnels lead to valves DD, II, BB",
  "Valve BB has flow rate=13; tunnels lead to valves CC, AA",
  "Valve CC has flow rate=2; tunnels lead to valves DD, BB",
  "Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE",
  "Valve EE has flow rate=3; tunnels lead to valves FF, DD",
  "Valve FF has flow rate=0; tunnels lead to valves EE, GG",
  "Valve GG has flow rate=0; tunnels lead to valves FF, HH",
  "Valve HH has flow rate=22; tunnel leads to valve GG",
  "Valve II has flow rate=0; tunnels lead to valves AA, JJ",
  "Valve JJ has flow rate=21; tunnel leads to valve II",
];

const testSetup1 = {
  //
  valves: {
    AA: { pressureToRelease: 0, tunnels: ["DD", "II", "BB"] },
    BB: { pressureToRelease: 13, tunnels: ["CC", "AA"] },
    CC: { pressureToRelease: 2, tunnels: ["DD", "BB"] },
    DD: { pressureToRelease: 20, tunnels: ["CC", "AA", "EE"] },
    EE: { pressureToRelease: 3, tunnels: ["FF", "DD"] },
    FF: { pressureToRelease: 0, tunnels: ["EE", "GG"] },
    GG: { pressureToRelease: 0, tunnels: ["FF", "HH"] },
    HH: { pressureToRelease: 22, tunnels: ["GG"] },
    II: { pressureToRelease: 0, tunnels: ["AA", "JJ"] },
    JJ: { pressureToRelease: 21, tunnels: ["II"] },
  },
};

describe("parseLinesIntoSetup", () => {
  const { parseLinesIntoSetup } = Import;
  it("works as expected", () => {
    // expect(parseLinesIntoSetup(testData1, true)).toMatchInlineSnapshot();
    expect(parseLinesIntoSetup(testData1, true)).toEqual(testSetup1);
    expect(parseLinesIntoSetup(testData1, false)).toEqual(testSetup1);
  });
});

describe("getMaxPressureToRelease", () => {
  const { getMaxPressureToRelease } = Import;
  it("works as expected", () => {
    const result = getMaxPressureToRelease(testSetup1);
    expect(result).toBe(1651);
  });
});

describe("findShortestPath", () => {
  const { findShortestPath } = Import;
  it("works as expected", () => {
    expect(findShortestPath(testSetup1, "AA", "AA")).toEqual(["AA"]);
    expect(findShortestPath(testSetup1, "AA", "GG")).toEqual(["AA", "DD", "EE", "FF", "GG"]);
  });
});

describe("listShortestPathsBetweenInterestingValves", () => {
  const { listShortestPathsBetweenInterestingValves } = Import;
  it("works as expected", () => {
    const result = listShortestPathsBetweenInterestingValves(testSetup1);
    expect(result).toHaveLength(21);
    expect(result.slice(0, 4)).toEqual([
      { start: "AA", end: "BB", forwards: ["AA", "BB"], backwards: ["BB", "AA"] },
      { start: "AA", end: "CC", forwards: ["AA", "DD", "CC"], backwards: ["CC", "DD", "AA"] },
      { start: "AA", end: "DD", forwards: ["AA", "DD"], backwards: ["DD", "AA"] },
      { start: "AA", end: "EE", forwards: ["AA", "DD", "EE"], backwards: ["EE", "DD", "AA"] },
    ]);

    const lines = Helpers.parseInputData();
    const setup = Import.parseLinesIntoSetup(lines, false);
    const result2 = listShortestPathsBetweenInterestingValves(setup);
    expect(result2).toHaveLength(120);
    expect(result2[0]).toEqual({
      start: "AA",
      end: "AW",
      forwards: ["AA", "PE", "WW", "DY", "YI", "MZ", "UA", "KY", "AW"],
      backwards: ["AW", "KY", "UA", "MZ", "YI", "DY", "WW", "PE", "AA"],
    });
  });
});

describe("yieldPossiblePaths", () => {
  const { yieldPossiblePaths } = Import;
  it("works as expected on test data", () => {
    let results = [];
    const _yield = item => {
      results.push(item);
      return true;
    };

    const shortestPaths = Import.listShortestPathsBetweenInterestingValves(testSetup1);
    yieldPossiblePaths({
      shortestPaths,
      setup: testSetup1,
      maxPathLength: 26,
      valvesToIgnore: ["JJ", "BB", "CC"],
      yieldCallback: _yield,
      yieldsShorterPaths: true,
    });
    expect(results).toHaveLength(15);
    expect(results.slice(0, 5)).toEqual([
      { pathLength: 2, targets: ["DD"] },
      { pathLength: 4, targets: ["DD", "EE"] },
      { pathLength: 8, targets: ["DD", "EE", "HH"] },
      { pathLength: 7, targets: ["DD", "HH"] },
      { pathLength: 11, targets: ["DD", "HH", "EE"] },
    ]);
  });

  it("works as expected on real data", () => {
    let results = [];
    const _yield = item => {
      results.push(item);
      return true;
    };

    const lines = Helpers.parseInputData();
    const setup = Import.parseLinesIntoSetup(lines, true);
    const shortestPaths = Import.listShortestPathsBetweenInterestingValves(setup);

    yieldPossiblePaths({
      shortestPaths,
      setup,
      maxPathLength: 26,
      valvesToIgnore: [],
      yieldCallback: _yield,
      yieldsShorterPaths: true,
    });
    expect(results).toHaveLength(69718);
    expect(results[179]).toEqual({
      pathLength: 24,
      targets: ["EG", "FL", "EL", "YI", "CR"],
    });

    results = [];
    yieldPossiblePaths({
      shortestPaths,
      setup,
      maxPathLength: 26,
      valvesToIgnore: ["UA", "FL"],
      yieldCallback: _yield,
      yieldsShorterPaths: false,
    });
    expect(results).toHaveLength(8233);
  });
});

describe("getReleasedPressureOnPath", () => {
  const { getReleasedPressureOnPath } = Import;
  it("works as expected with test data", () => {
    const shortestPaths = Import.listShortestPathsBetweenInterestingValves(testSetup1);
    const result1 = getReleasedPressureOnPath({
      shortestPaths,
      setup: testSetup1,
      maxMinutes: 26,
      targets: ["JJ", "BB", "CC"],
    });
    const result2 = getReleasedPressureOnPath({
      shortestPaths,
      setup: testSetup1,
      maxMinutes: 26,
      targets: ["DD", "HH", "EE"],
    });
    expect(result1).toBe(764);
    expect(result2).toBe(943);
    expect(result1 + result2).toBe(1707);
  });

  it("works as expected with real data", () => {
    const lines = Helpers.parseInputData();
    const setup = Import.parseLinesIntoSetup(lines, true);
    const shortestPaths = Import.listShortestPathsBetweenInterestingValves(setup);

    const result = getReleasedPressureOnPath({
      shortestPaths,
      setup,
      maxMinutes: 26,
      targets: ["EG", "FL", "EL", "YI", "CR"],
    });
    expect(result).toMatchInlineSnapshot(`1054`);
  });
});

describe("getMaxPressureToReleaseWithHelpingElephant", () => {
  const { getMaxPressureToReleaseWithHelpingElephant } = Import;
  it("works as expected", () => {
    const result = getMaxPressureToReleaseWithHelpingElephant(testSetup1);
    expect(result).toBe(1707);
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

describe.skip("getSolutionPart1", () => {
  // took 3 minutes...
  const { getSolutionPart1 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart1();
    expect(result).toBe(2087);
  });
});

describe.skip("getSolutionPart2", () => {
  // took 80 minutes...
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    // @ts-ignore
    const result = getSolutionPart2(console.log, console.log);
    expect(result).not.toBe(1691);
    expect(result).not.toBe(1730);
    expect(result).not.toBe(2232);
    expect(result).not.toBe(2233);
    expect(result).not.toBe(2443);
    expect(result).toBe(2591);
  });
});
