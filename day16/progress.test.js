const Progress = require("./progress");

jest.useFakeTimers();

describe("Progress", () => {
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
      "11:23:27: 91% done (1629 steps), ready ~11:25:39 (1.2 steps/sec)",
      "11:23:57: 92% done (1647 steps), ready ~11:25:55 (1.2 steps/sec)",
      "11:24:27: 93% done (1665 steps), ready ~11:26:11 (1.1 steps/sec)",
      "11:24:57: 94% done (1683 steps), ready ~11:26:27 (1.1 steps/sec)",
      "11:25:27: 95% done (1701 steps), ready ~11:26:43 (1.1 steps/sec)",
      "11:25:58: 96% done (1719 steps), ready ~11:26:59 (1.1 steps/sec)",
      "11:26:29: 97% done (1737 steps), ready ~11:27:16 (1.1 steps/sec)",
      "11:27:01: 98% done (1755 steps), ready ~11:27:32 (1.1 steps/sec)",
      "11:27:33: 99% done (1773 steps), ready ~11:27:48 (1.1 steps/sec)",
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
      "11:02:19: 1 min gone (16 steps), ready ~12:54:18 (0.2 steps/sec)",
      "11:02:26: 1% done (18 steps), ready ~12:53:30 (0.2 steps/sec)",
      "11:03:29: 2% done (36 steps), ready ~12:50:00 (0.2 steps/sec)",
      "11:04:32: 3% done (54 steps), ready ~12:48:28 (0.2 steps/sec)",
    ]);

    expect(log.slice(-10)).toEqual([
      "11:54:00: 88% done (1576 steps), ready ~12:01:09 (0.4 steps/sec)",
      "11:54:07: 89% done (1594 steps), ready ~12:00:37 (0.5 steps/sec)",
      "11:54:14: 90% done (1611 steps), ready ~12:00:07 (0.5 steps/sec)",
      "11:54:20: 91% done (1629 steps), ready ~11:59:34 (0.5 steps/sec)",
      "11:54:25: 92% done (1647 steps), ready ~11:59:02 (0.5 steps/sec)",
      "11:54:31: 93% done (1666 steps), ready ~11:58:28 (0.5 steps/sec)",
      "11:54:36: 94% done (1689 steps), ready ~11:57:47 (0.5 steps/sec)",
      "11:54:41: 95% done (1718 steps), ready ~11:56:55 (0.5 steps/sec)",
      "11:54:46: 99% done (1777 steps), ready ~11:55:09 (0.5 steps/sec)",
      "11:54:46: finished, processed 1790 steps in 00:53:27",
    ]);
  });
});
