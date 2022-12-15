// @ts-check

const Import = require("./index");

const testData1 = [
  //
  "Sensor at x=2, y=18: closest beacon is at x=-2, y=15",
  "Sensor at x=9, y=16: closest beacon is at x=10, y=16",
  "Sensor at x=13, y=2: closest beacon is at x=15, y=3",
  "Sensor at x=12, y=14: closest beacon is at x=10, y=16",
  "Sensor at x=10, y=20: closest beacon is at x=10, y=16",
  "Sensor at x=14, y=17: closest beacon is at x=10, y=16",
  "Sensor at x=8, y=7: closest beacon is at x=2, y=10",
  "Sensor at x=2, y=0: closest beacon is at x=2, y=10",
  "Sensor at x=0, y=11: closest beacon is at x=2, y=10",
  "Sensor at x=20, y=14: closest beacon is at x=25, y=17",
  "Sensor at x=17, y=20: closest beacon is at x=21, y=22",
  "Sensor at x=16, y=7: closest beacon is at x=15, y=3",
  "Sensor at x=14, y=3: closest beacon is at x=15, y=3",
  "Sensor at x=20, y=1: closest beacon is at x=15, y=3",
];

const testSetup1 = {
  //
  sensors: [
    { x: 2, y: 18, closestBeacon: { x: -2, y: 15 } },
    { x: 9, y: 16, closestBeacon: { x: 10, y: 16 } },
    { x: 13, y: 2, closestBeacon: { x: 15, y: 3 } },
    { x: 12, y: 14, closestBeacon: { x: 10, y: 16 } },
    { x: 10, y: 20, closestBeacon: { x: 10, y: 16 } },
    { x: 14, y: 17, closestBeacon: { x: 10, y: 16 } },
    { x: 8, y: 7, closestBeacon: { x: 2, y: 10 } },
    { x: 2, y: 0, closestBeacon: { x: 2, y: 10 } },
    { x: 0, y: 11, closestBeacon: { x: 2, y: 10 } },
    { x: 20, y: 14, closestBeacon: { x: 25, y: 17 } },
    { x: 17, y: 20, closestBeacon: { x: 21, y: 22 } },
    { x: 16, y: 7, closestBeacon: { x: 15, y: 3 } },
    { x: 14, y: 3, closestBeacon: { x: 15, y: 3 } },
    { x: 20, y: 1, closestBeacon: { x: 15, y: 3 } },
  ],
  knownBeacons: [
    { x: -2, y: 15 },
    { x: 10, y: 16 },
    { x: 15, y: 3 },
    { x: 2, y: 10 },
    { x: 25, y: 17 },
    { x: 21, y: 22 },
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

describe("countNonBeaconCoordinatesOfLine", () => {
  const { countNonBeaconCoordinatesOfLine } = Import;
  it("works as expected", () => {
    const result = countNonBeaconCoordinatesOfLine(testSetup1, 10);
    expect(result).toEqual(26);
  });
});

describe("getBeaconCoordinatesOfLine", () => {
  const { getBeaconCoordinatesOfLine } = Import;
  it("works as expected", () => {
    const result = getBeaconCoordinatesOfLine(testSetup1, 11);
    expect(result).toEqual([14]);
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
    expect(result).not.toBe(5040644);
    expect(result).toBe(5040643);
  });
});

describe("getSolutionPart2", () => {
  const { getSolutionPart2 } = Import;
  it("- when used with real data - works as expected", () => {
    const result = getSolutionPart2();
    expect(result).toBe(11016575214126);
  });
});
