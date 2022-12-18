// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: null,
  asInteger: false,
  dontTrimInput: true,
});

if (process.env.NODE_ENV !== "test") {
  console.log("Javascript");
  const part = process.env.part || "part1";
  if (part === "part1") {
    console.log(getSolutionPart1());
  } else {
    console.log(getSolutionPart2());
  }
}

function getSolutionPart1() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, true);
  return getMaxPressureToRelease(setup);
}

function getSolutionPart2(onProgress = null, onNewMaximum = null) {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  return getMaxPressureToReleaseWithHelpingElephant(setup, onProgress, onNewMaximum);
}

/**
 * @typedef SETUP
 * @property {object} valves
 */

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { valves: {} };

  lines.forEach(line => {
    if (line) {
      let valveName;
      const valveData = { pressureToRelease: 0, tunnels: [] };
      const regexp = /[A-Z][A-Z]|\d+/g;
      for (let index = 0, match = regexp.exec(line); match; index++, match = regexp.exec(line)) {
        if (index === 0) {
          valveName = match[0];
        } else if (index === 1) {
          valveData.pressureToRelease = parseInt(match[0], 10);
        } else {
          // @ts-ignore
          valveData.tunnels.push(match[0]);
        }
      }
      if (valveName) {
        setup.valves[valveName] = valveData;
      }
    }
  });

  return setup;
}

/** @param {SETUP} setup */
function getMaxPressureToRelease(setup) {
  let maxReleasedPressure = 0;

  const _recursion = ({ minute, valveName, prevValveName, openedValves, releasedPressure: oldReleasedPressure }) => {
    if (minute === 30) {
      maxReleasedPressure = Math.max(maxReleasedPressure, oldReleasedPressure);
      return;
    }

    const releasedPressure =
      oldReleasedPressure + openedValves.reduce((acc, curr) => acc + setup.valves[curr].pressureToRelease, 0);

    if (!openedValves.includes(valveName) && setup.valves[valveName].pressureToRelease > 0) {
      _recursion({
        minute: minute + 1,
        valveName,
        prevValveName: "",
        openedValves: [...openedValves, valveName],
        releasedPressure,
      });
    }
    setup.valves[valveName].tunnels.forEach(newValveName => {
      if (newValveName !== prevValveName) {
        _recursion({
          minute: minute + 1,
          valveName: newValveName,
          prevValveName: valveName,
          openedValves,
          releasedPressure,
        });
      }
    });
  };

  _recursion({ minute: 0, valveName: "AA", prevValveName: "", openedValves: [], releasedPressure: 0 });

  return maxReleasedPressure;
}

/** @param {SETUP} setup */
/** @param {Function | null} [onProgress] */
/** @param {Function | null} [onNewMaximum] */
function getMaxPressureToReleaseWithHelpingElephant(setup, onProgress = null, onNewMaximum = null) {
  let maxReleasedPressure = 0;

  const shortestPaths = listShortestPathsBetweenInterestingValves(setup);

  const _yield = ({ item1, item2 }) => {
    const pressure =
      getReleasedPressureOnPath({ shortestPaths, maxMinutes: 26, setup, targets: item1.targets }) +
      getReleasedPressureOnPath({ shortestPaths, maxMinutes: 26, setup, targets: item2.targets });
    if (pressure > maxReleasedPressure) {
      maxReleasedPressure = pressure;
      onNewMaximum && onNewMaximum({ maxReleasedPressure, targets1: item1.targets, targets2: item2.targets });
    }
    return true;
  };

  yieldCombinedPaths({ setup, maxPathLength: 26, yieldCallback: _yield, onProgress });

  return maxReleasedPressure;
}

/** @param {SETUP} setup */
function listShortestPathsBetweenInterestingValves(setup) {
  const result = [];

  const interestingValves = Object.keys(setup.valves).filter(
    valveName => valveName === "AA" || setup.valves[valveName].pressureToRelease > 0
  );

  interestingValves.sort((a, b) => (a < b ? -1 : 1));

  for (let startIndex = 0; startIndex < interestingValves.length - 1; startIndex++) {
    for (let endIndex = startIndex + 1; endIndex < interestingValves.length; endIndex++) {
      const newItem = {};
      newItem.start = interestingValves[startIndex];
      newItem.end = interestingValves[endIndex];
      newItem.forwards = findShortestPath(setup, newItem.start, newItem.end);
      newItem.backwards = [...newItem.forwards].reverse();
      result.push(newItem);
    }
  }

  return result;
}

/** @param {SETUP} setup */
function findShortestPath(setup, startValve, finishValve) {
  let result = [];

  const _recursion = ({ currPath }) => {
    const currValveName = currPath[currPath.length - 1];

    if (currValveName === finishValve) {
      if (result.length === 0 || currPath.length < result.length) {
        result = currPath;
      }
      return;
    }

    setup.valves[currValveName].tunnels.forEach(newValveName => {
      if (currPath.includes(newValveName)) {
        return;
      }
      _recursion({ currPath: [...currPath, newValveName] });
    });
  };

  _recursion({ currPath: [startValve] });

  return result;
}

function getReleasedPressureOnPath({ shortestPaths, maxMinutes, setup, targets }) {
  let releasedPressure = 0;

  const _getPathLength = (start, end) => {
    const pathItem = shortestPaths.find(
      item => [item.start, item.end].includes(start) && [item.start, item.end].includes(end)
    );
    if (!pathItem) {
      console.log({ start, end, targets });
      throw new Error("Can't find path-item");
    }
    return pathItem?.forwards.length - 1;
  };

  let currTargetIndex = 0;
  let remainingStepsToTarget = targets[0] ? _getPathLength("AA", targets[0]) : 0;
  const openedValves = [];

  for (let minute = 0; minute < maxMinutes; minute++) {
    releasedPressure += openedValves.reduce((acc, valveName) => acc + setup.valves[valveName].pressureToRelease, 0);
    if (remainingStepsToTarget > 0) {
      remainingStepsToTarget--;
    } else {
      const currTarget = targets[currTargetIndex];
      if (currTarget) {
        openedValves.push(currTarget);
        currTargetIndex++;
        const nextTarget = targets[currTargetIndex];
        if (nextTarget) {
          remainingStepsToTarget = _getPathLength(currTarget, nextTarget);
        }
      }
    }
  }

  return releasedPressure;
}

function yieldCombinedPaths({ setup, maxPathLength, yieldCallback, onProgress }) {
  const shortestPaths = listShortestPathsBetweenInterestingValves(setup);
  const progress = new Helpers.Progress({ handleLogEvent: onProgress });

  let isRunning = true;

  const listOfFirstPaths = [];
  const _memorizeFirstPath = item => {
    listOfFirstPaths.push(item);
    return true;
  };

  yieldPossiblePaths({
    shortestPaths,
    setup,
    maxPathLength,
    valvesToIgnore: [],
    yieldCallback: _memorizeFirstPath,
    yieldsShorterPaths: true,
  });

  const _processPairOfPaths = (item1, item2) => {
    if (!yieldCallback({ item1, item2 })) {
      isRunning = false;
      return false;
    }
    return true;
  };

  progress.init(listOfFirstPaths.length);

  listOfFirstPaths.forEach((item1, index) => {
    if (!isRunning) {
      return;
    }

    progress.step(index);

    yieldPossiblePaths({
      shortestPaths,
      setup,
      maxPathLength,
      valvesToIgnore: item1.targets,
      yieldCallback: item2 => _processPairOfPaths(item1, item2),
      yieldsShorterPaths: false,
    });
  });

  progress.finalize();
}

function yieldPossiblePaths({
  shortestPaths,
  setup,
  maxPathLength,
  valvesToIgnore,
  yieldCallback,
  yieldsShorterPaths,
}) {
  const interestingValves = Object.keys(setup.valves).filter(
    valveName => !valvesToIgnore.includes(valveName) && setup.valves[valveName].pressureToRelease > 0
  );

  let isRunning = true;

  const _yield = item => {
    if (!yieldCallback(item)) {
      isRunning = false;
    }
  };

  const _recursion = ({ targets, pathLength }) => {
    if (!isRunning) {
      return;
    }
    if (pathLength >= maxPathLength) {
      _yield({ targets, pathLength });
      return;
    }

    if (yieldsShorterPaths && targets.length > 0) {
      _yield({ targets, pathLength });
    }

    const currValveName = targets[targets.length - 1] || "AA";
    const possibleTargets = interestingValves.filter(valveName => !targets.includes(valveName));
    if (possibleTargets.length === 0) {
      if (!yieldsShorterPaths) {
        _yield({ targets, pathLength });
      }
      return;
    }

    possibleTargets.forEach(targetValveName => {
      const pathItem = shortestPaths.find(
        item => [item.start, item.end].includes(currValveName) && [item.start, item.end].includes(targetValveName)
      );
      if (!pathItem) {
        throw new Error("Can't find path-item");
      }
      const path = pathItem.start === currValveName ? pathItem?.forwards : pathItem?.backwards;
      if (pathLength + path.length <= maxPathLength) {
        _recursion({
          targets: [...targets, targetValveName],
          pathLength: pathLength + path.length,
        });
      }
    });
  };

  _recursion({ targets: [], pathLength: 0 });
}

/** @param {SETUP} setup */
/**
function placeholder(setup) {
  const results = [];

  return results;
}

**/

module.exports = {
  getSolutionPart1,
  getSolutionPart2,

  parseLinesIntoSetup,
  getMaxPressureToRelease,
  findShortestPath,
  listShortestPathsBetweenInterestingValves,
  yieldPossiblePaths,
  getReleasedPressureOnPath,
  getMaxPressureToReleaseWithHelpingElephant,
};
