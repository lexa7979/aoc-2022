const Helpers = require("./helpers");

const fs = require("fs");
jest.mock("fs");

describe.skip("parseInputData", () => {
  const { parseInputData, setParseOptions } = Helpers;

  const cleanup = [];
  afterEach(() => cleanup.splice(0).forEach(cb => cb()));

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

  it("- when not using dontTrimInput - removes whitespaces from the beginning and end when parsing input-file", () => {
    setParseOptions({ transformMatch: null, asInteger: false });
    // @ts-ignore
    fs.readFileSync.mockReturnValue("  \n     Lorem  \n   ipsum   \n\n   \n\n");
    expect(parseInputData()).toEqual(["Lorem  ", "   ipsum"]);
  });

  it("- when using dontTrimInput - keeps spaces and empty lines when parsing input-file", () => {
    setParseOptions({ transformMatch: null, asInteger: false, dontTrimInput: true });
    // @ts-ignore
    fs.readFileSync.mockReturnValue("  \n     Lorem  \n   ipsum   \n\n   \n\n");
    expect(parseInputData()).toEqual(["  ", "     Lorem  ", "   ipsum   ", "", "   ", "", ""]);
  });
});

describe.skip("getArrayRange", () => {
  const { getArrayRange } = Helpers;
  it("works as expected", () => {
    expect(getArrayRange(3, 6)).toEqual([3, 4, 5, 6]);
    expect(getArrayRange(7, 6)).toEqual([7, 6]);
    expect(getArrayRange(5, 5)).toEqual([5]);
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

describe.skip("paintCoordinates", () => {
  const { paintCoordinates } = Helpers;

  const map1 = [
    //
    "...........#",
    "............",
    "............",
    "............",
    "..#.........",
    "............",
    "........#...",
    ".....#..#...",
    "............",
    ".#..s.......",
    "............",
    "............",
    ".....#......",
    "............",
    "............",
    "#...........",
  ];

  const map2 = [
    //
    "..##.",
    "...##",
    ".####",
    "....#",
    "S###.",
  ];

  it("- when no coordinates are given - works as expected", () => {
    const result = paintCoordinates({ list: [] });
    expect(result).toEqual(["s"]);
  });

  it("- when some coordinates are given as string - works as expected", () => {
    const result = paintCoordinates({
      list: [
        //
        "-3;0",
        "1;-3",
        "-2;5",
        "-4;-6",
        "7;9",
        "4;2",
        "4;3",
        "1;2",
      ],
    });
    expect(result).toEqual(map1);
  });

  it("- when some coordinates are given object - works as expected", () => {
    const list = [
      //
      { x: -3, y: 0 },
      { x: 1, y: -3 },
      { x: -2, y: 5 },
      { x: -4, y: -6 },
      { x: 7, y: 9 },
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 1, y: 2 },
    ];
    expect(paintCoordinates({ list, format: "{x,y}" })).toEqual(map1);
  });

  it("- when some other coordinates are given as string - works as expected", () => {
    const result = paintCoordinates({
      list: [
        //
        "0;0",
        "1;0",
        "2;0",
        "3;0",
        "4;1",
        "4;2",
        "4;3",
        "3;4",
        "2;4",
        "3;3",
        "3;2",
        "2;2",
        "1;2",
      ],
    });
    expect(result).toEqual(map2);
  });
});

describe.skip("Progress", () => {
  const { Progress } = Helpers;

  jest.useFakeTimers();

  it("works as expected when process runs at constant speed", () => {
    jest.setSystemTime(new Date("2022-12-18T10:01:18.722Z"));

    const log = [];
    const maxStepCount = 1790;
    const obj = new Progress({ handleLogEvent: data => log.push(data) });

    obj.init(maxStepCount);
    for (let i = 0; i < maxStepCount; i++) {
      jest.advanceTimersByTime(100);
      obj.step(i);
    }
    obj.finalize();

    expect(log.slice(0, 5)).toEqual([
      "11:01:18: init, awaiting 1790 steps",
      "11:01:23: 2% done (49 steps), ready ~11:04:21 (9.7 steps/sec)",
      "11:01:28: 5% done (99 steps), ready ~11:04:19 (9.9 steps/sec)",
      "11:01:33: 8% done (149 steps), ready ~11:04:18 (9.9 steps/sec)",
      "11:01:38: 11% done (199 steps), ready ~11:04:18 (9.9 steps/sec)",
    ]);

    expect(log.slice(-5)).toEqual([
      "11:03:58: 89% done (1599 steps), ready ~11:04:17 (9.9 steps/sec)",
      "11:04:03: 92% done (1649 steps), ready ~11:04:17 (9.9 steps/sec)",
      "11:04:08: 94% done (1699 steps), ready ~11:04:17 (9.9 steps/sec)",
      "11:04:13: 97% done (1749 steps), ready ~11:04:17 (9.9 steps/sec)",
      "11:04:17: finished, processed 1790 steps in 00:02:59",
    ]);
  });

  it("works as expected when process is finalized earlier", () => {
    jest.setSystemTime(new Date("2022-12-18T10:01:18.722Z"));

    const log = [];
    const maxStepCount = 1790;
    const obj = new Progress({ handleLogEvent: data => log.push(data) });

    obj.init(maxStepCount);
    for (let i = 0; i < maxStepCount; i++) {
      jest.advanceTimersByTime(100);
      obj.step(i);
      if (i > 0.79 * maxStepCount) {
        obj.finalize(i);
        break;
      }
    }

    expect(log.slice(0, 5)).toEqual([
      "11:01:18: init, awaiting 1790 steps",
      "11:01:23: 2% done (49 steps), ready ~11:04:21 (9.7 steps/sec)",
      "11:01:28: 5% done (99 steps), ready ~11:04:19 (9.9 steps/sec)",
      "11:01:33: 8% done (149 steps), ready ~11:04:18 (9.9 steps/sec)",
      "11:01:38: 11% done (199 steps), ready ~11:04:18 (9.9 steps/sec)",
    ]);

    expect(log.slice(-5)).toEqual([
      "11:03:23: 69% done (1249 steps), ready ~11:04:17 (9.9 steps/sec)",
      "11:03:28: 72% done (1299 steps), ready ~11:04:17 (9.9 steps/sec)",
      "11:03:33: 75% done (1349 steps), ready ~11:04:17 (9.9 steps/sec)",
      "11:03:38: 78% done (1399 steps), ready ~11:04:17 (9.9 steps/sec)",
      "11:03:40: finished, processed 1415 steps in 00:02:21",
    ]);
  });

  it("works as expected when process is getting slower", () => {
    jest.setSystemTime(new Date("2022-12-18T10:01:18.722Z"));

    const log = [];
    const maxStepCount = 1790;
    const obj = new Progress({ handleLogEvent: data => log.push(data) });

    obj.init(maxStepCount);
    for (let i = 0; i < maxStepCount; i++) {
      jest.advanceTimersByTime(i + 1);
      obj.step(i);
    }
    obj.finalize();

    expect(log.slice(0, 5)).toEqual([
      "11:01:18: init, awaiting 1790 steps",
      "11:01:23: 5% done (99 steps), ready ~11:02:50 (19.6 steps/sec)",
      "11:01:28: 7% done (141 steps), ready ~11:03:27 (13.8 steps/sec)",
      "11:01:33: 9% done (173 steps), ready ~11:03:56 (11.3 steps/sec)",
      "11:01:39: 11% done (200 steps), ready ~11:04:20 (9.8 steps/sec)",
    ]);

    expect(log.slice(-10)).toEqual([
      "11:23:27: 91% done (1629 steps), ready ~11:25:39 (0.8 seconds/step)",
      "11:23:57: 92% done (1647 steps), ready ~11:25:55 (0.8 seconds/step)",
      "11:24:27: 93% done (1665 steps), ready ~11:26:11 (0.8 seconds/step)",
      "11:24:57: 94% done (1683 steps), ready ~11:26:27 (0.8 seconds/step)",
      "11:25:27: 95% done (1701 steps), ready ~11:26:43 (0.8 seconds/step)",
      "11:25:58: 96% done (1719 steps), ready ~11:26:59 (0.8 seconds/step)",
      "11:26:29: 97% done (1737 steps), ready ~11:27:16 (0.8 seconds/step)",
      "11:27:01: 98% done (1755 steps), ready ~11:27:32 (0.8 seconds/step)",
      "11:27:33: 99% done (1773 steps), ready ~11:27:48 (0.8 seconds/step)",
      "11:28:01: finished, processed 1790 steps in 00:26:42",
    ]);
  });

  it("works as expected when process is getting faster", () => {
    jest.setSystemTime(new Date("2022-12-18T10:01:18.722Z"));

    const log = [];
    const maxStepCount = 1790;
    const obj = new Progress({ handleLogEvent: data => log.push(data) });

    obj.init(maxStepCount);
    for (let i = 0; i < maxStepCount; i++) {
      jest.advanceTimersByTime(2 * (maxStepCount - i) + 1);
      obj.step(i);
    }
    obj.finalize();

    expect(log.slice(0, 5)).toEqual([
      "11:01:18: init, awaiting 1790 steps",
      "11:02:19: 1 min passed (16 steps), ready ~12:54:18 (3.7 seconds/step)",
      "11:02:26: 1% done (18 steps), ready ~12:53:30 (3.7 seconds/step)",
      "11:03:29: 2% done (36 steps), ready ~12:50:00 (3.6 seconds/step)",
      "11:04:32: 3% done (54 steps), ready ~12:48:28 (3.5 seconds/step)",
    ]);

    expect(log.slice(-10)).toEqual([
      "11:54:00: 88% done (1576 steps), ready ~12:01:09 (2 seconds/step)",
      "11:54:07: 89% done (1594 steps), ready ~12:00:37 (1.9 seconds/step)",
      "11:54:14: 90% done (1611 steps), ready ~12:00:07 (1.9 seconds/step)",
      "11:54:20: 91% done (1629 steps), ready ~11:59:34 (1.9 seconds/step)",
      "11:54:25: 92% done (1647 steps), ready ~11:59:02 (1.9 seconds/step)",
      "11:54:31: 93% done (1666 steps), ready ~11:58:28 (1.9 seconds/step)",
      "11:54:36: 94% done (1689 steps), ready ~11:57:47 (1.8 seconds/step)",
      "11:54:41: 95% done (1718 steps), ready ~11:56:55 (1.8 seconds/step)",
      "11:54:46: 99% done (1777 steps), ready ~11:55:09 (1.8 seconds/step)",
      "11:54:46: finished, processed 1790 steps in 00:53:27",
    ]);
  });
});
