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

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  return getMaxPressureToReleasePart2(setup);
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
function getMaxPressureToReleasePart2(setup) {
  let maxReleasedPressure = 0;

  const shortestPaths = listShortestPathsBetweenInterestingValves(setup);

  const _yield = ({ item1, item2 }) => {
    const pressure =
      getReleasedPressureOnPath({ shortestPaths, maxMinutes: 26, setup, targets: item1.targets }) +
      getReleasedPressureOnPath({ shortestPaths, maxMinutes: 26, setup, targets: item2.targets });
    if (pressure > maxReleasedPressure) {
      maxReleasedPressure = pressure;
      console.log({ maxReleasedPressure, targets1: item1.targets, targets2: item2.targets });
    }
    return true;
  };

  yieldCombinedPaths2({ setup, maxPathLength: 26, yieldCallback: _yield });

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

function yieldCombinedPaths2({ setup, maxPathLength, yieldCallback }) {
  const shortestPaths = listShortestPathsBetweenInterestingValves(setup);

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

  console.log("Number of collected first paths:", listOfFirstPaths.length);

  const _processPairOfPaths = (item1, item2) => {
    if (!yieldCallback({ item1, item2 })) {
      isRunning = false;
      return false;
    }
    return true;
  };

  let latestProgressInfo = null;
  listOfFirstPaths.forEach((item1, index) => {
    const progress = Math.floor(((index + 1) / listOfFirstPaths.length) * 100);
    if (latestProgressInfo !== progress) {
      console.log({ progress });
      latestProgressInfo = progress;
    }
    yieldPossiblePaths({
      shortestPaths,
      setup,
      maxPathLength,
      valvesToIgnore: item1.targets,
      yieldCallback: item2 => _processPairOfPaths(item1, item2),
      yieldsShorterPaths: false,
    });
  });
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

// /** @param {SETUP} setup */
// function getMaxPressureToReleaseWithHelpingElephant(setup) {
//   let maxReleasedPressure = 0;

//   const log = [];

//   const interestingValves = Object.keys(setup.valves).filter(
//     valveName => setup.valves[valveName].pressureToRelease > 0
//   );

//   const _recursion = ({
//     minute,
//     isStepOfElephant,
//     valveNames,
//     prevValveNames,
//     openedValves,
//     releasedPressure: oldReleasedPressure,
//   }) => {
//     // log.push({ minute, isStepOfElephant, valveNames, prevValveNames, openedValves, oldReleasedPressure });

//     if (minute === 26) {
//       maxReleasedPressure = Math.max(maxReleasedPressure, oldReleasedPressure);
//       return;
//     }

//     const releasedPressure = !isStepOfElephant
//       ? oldReleasedPressure + openedValves.reduce((acc, curr) => acc + setup.valves[curr].pressureToRelease, 0)
//       : oldReleasedPressure;

//     if (openedValves.length === interestingValves.length) {
//       _recursion({
//         minute: minute + 1,
//         isStepOfElephant: false,
//         valveNames,
//         prevValveNames,
//         openedValves,
//         releasedPressure,
//       });
//       return;
//     }

//     const currValveName = isStepOfElephant ? valveNames[1] : valveNames[0];

//     if (!openedValves.includes(currValveName) && interestingValves.includes(currValveName)) {
//       _recursion({
//         minute: isStepOfElephant ? minute + 1 : minute,
//         isStepOfElephant: !isStepOfElephant,
//         valveNames,
//         prevValveNames: isStepOfElephant ? [prevValveNames[0], ""] : ["", prevValveNames[1]],
//         openedValves: [...openedValves, currValveName],
//         releasedPressure,
//       });
//     }

//     setup.valves[currValveName].tunnels.forEach(newValveName => {
//       const wouldGoBack = newValveName === prevValveNames[isStepOfElephant ? 1 : 0];
//       const wouldDoSameAsPartner = isStepOfElephant
//         ? prevValveNames[0] && currValveName === prevValveNames[0] && newValveName === valveNames[0]
//         : prevValveNames[1] && currValveName === prevValveNames[1] && newValveName === valveNames[1];
//       if (!wouldGoBack && !wouldDoSameAsPartner) {
//         _recursion({
//           minute: isStepOfElephant ? minute + 1 : minute,
//           isStepOfElephant: !isStepOfElephant,
//           valveNames: isStepOfElephant ? [valveNames[0], newValveName] : [newValveName, valveNames[1]],
//           prevValveNames: isStepOfElephant ? [prevValveNames[0], currValveName] : [currValveName, prevValveNames[1]],
//           openedValves,
//           releasedPressure,
//         });
//       }
//     });
//   };

//   _recursion({
//     minute: 0,
//     isStepOfElephant: false,
//     valveNames: ["AA", "AA"],
//     prevValveNames: ["", ""],
//     openedValves: [],
//     releasedPressure: 0,
//   });

//   console.log(log.slice(0, 100));

//   return maxReleasedPressure;
// }

// /** @param {SETUP} setup */
// function getMaxPressureToReleaseWithHelpingElephantAndAiming(setup) {
//   let maxReleasedPressure = 0;
//   let testReleasedPressure = 0;

//   const log = [];

//   console.log("lexa");

//   const _recursion = ({
//     minute,
//     isStepOfElephant,
//     valveNames,
//     targets,
//     openedValves,
//     interestingValves,
//     releasedPressure,
//   }) => {
//     // if (log.length >= 100) {
//     //   return;
//     // }

//     const myIndex = isStepOfElephant ? 1 : 0;
//     const otherIndex = isStepOfElephant ? 0 : 1;
//     const currValveName = valveNames[myIndex];

//     const newReleasedPressure = isStepOfElephant
//       ? releasedPressure
//       : releasedPressure + openedValves.reduce((acc, valveName) => acc + setup.valves[valveName].pressureToRelease, 0);

//     const _log = (action, data) => {
//       return;
//       if (action) {
//         log.push({ action, ...data });
//       } else if (isStepOfElephant) {
//         log.push({ isStepOfElephant });
//       } else {
//         log.push({
//           minute,
//           // isStepOfElephant,
//           valveNames,
//           targets,
//           openedValves,
//           interestingValves,
//           releasedPressure,
//         });
//       }
//     };
//     _log();

//     // if (minute === 20) {
//     //   if (releasedPressure > testReleasedPressure) {
//     //     testReleasedPressure = releasedPressure;
//     //     console.log({
//     //       testReleasedPressure,
//     //       interestingValves,
//     //       valveNames,
//     //       targets,
//     //     });
//     //   }
//     // }

//     if (minute === 26) {
//       if (releasedPressure > maxReleasedPressure) {
//         console.log({ releasedPressure });
//         maxReleasedPressure = releasedPressure;
//       }
//       return;
//     }

//     if (interestingValves.length === 0) {
//       _log("wait", { currValveName, isStepOfElephant });
//       _recursion({
//         minute: minute + 1,
//         isStepOfElephant: false,
//         valveNames,
//         targets,
//         openedValves,
//         interestingValves,
//         releasedPressure: newReleasedPressure,
//       });
//       return;
//     }

//     const _hasTargetRightNow = targets[myIndex] != null;
//     const hasReachedTarget = _hasTargetRightNow && targets[myIndex] === currValveName;
//     const hasNotReachedTargetYet = _hasTargetRightNow && targets[myIndex] !== currValveName;
//     const isLastTargetAlreadyTaken =
//       !_hasTargetRightNow && interestingValves.length === 1 && targets[otherIndex] === interestingValves[0];
//     const shouldGetNewTarget = !_hasTargetRightNow && !isLastTargetAlreadyTaken;

//     if (hasReachedTarget) {
//       _log("open", { currValveName, isStepOfElephant });
//       const newTargets = [...targets];
//       newTargets[myIndex] = null;
//       _recursion({
//         minute: isStepOfElephant ? minute + 1 : minute,
//         isStepOfElephant: !isStepOfElephant,
//         valveNames,
//         targets: newTargets,
//         openedValves: [...openedValves, currValveName],
//         interestingValves: interestingValves.filter(valveName => valveName !== currValveName),
//         releasedPressure: newReleasedPressure,
//       });
//       return;
//     }

//     if (hasNotReachedTargetYet) {
//       _log("go", { currValveName, isStepOfElephant });
//       const targetPath = findShortestPath(setup, currValveName, targets[myIndex]);
//       const newValveNames = [...valveNames];
//       newValveNames[myIndex] = targetPath[1];
//       _recursion({
//         minute: isStepOfElephant ? minute + 1 : minute,
//         isStepOfElephant: !isStepOfElephant,
//         valveNames: newValveNames,
//         targets,
//         openedValves,
//         interestingValves,
//         releasedPressure: newReleasedPressure,
//       });
//       return;
//     }

//     if (isLastTargetAlreadyTaken) {
//       _log("wait", { currValveName, isStepOfElephant });
//       _recursion({
//         minute: isStepOfElephant ? minute + 1 : minute,
//         isStepOfElephant: !isStepOfElephant,
//         valveNames,
//         targets,
//         openedValves,
//         interestingValves,
//         releasedPressure: newReleasedPressure,
//       });
//       return;
//     }

//     if (shouldGetNewTarget) {
//       interestingValves.forEach(valveName => {
//         if (valveName !== targets[otherIndex]) {
//           _log("aim", { currValveName, valveName, isStepOfElephant });
//           const newTargets = [...targets];
//           newTargets[myIndex] = valveName;
//           _recursion({
//             minute,
//             isStepOfElephant,
//             valveNames,
//             targets: newTargets,
//             openedValves,
//             interestingValves,
//             releasedPressure,
//           });
//         }
//       });

//       return;
//     }
//   };

//   const interestingValves = Object.keys(setup.valves)
//     .filter(valveName => setup.valves[valveName].pressureToRelease > 0)
//     .filter(valveName => findShortestPath(setup, "AA", valveName).length > 0);

//   _recursion({
//     minute: 0,
//     isStepOfElephant: false,
//     valveNames: ["AA", "AA"],
//     targets: [null, null],
//     openedValves: [],
//     interestingValves,
//     releasedPressure: 0,
//   });

//   console.log(log.slice(0, 50));

//   return maxReleasedPressure;
// }

// /** @param {SETUP} setup */
// function listPossiblePathsWithHelpingElephant(setup) {
//   const results = [];

//   const _memorize = (chosenTargets, pathLengths) => {
//     const targetsString1 = chosenTargets[0].join("-");
//     const targetsString2 = chosenTargets[1].join("-");
//     if (chosenTargets[0][1] < chosenTargets[1][1]) {
//       results.push(`${targetsString1};${targetsString2}`);
//     }
//     return;
//     if (
//       results.some(
//         item =>
//           [targetsString1, targetsString2].includes(item.chosenTargets[0]) &&
//           [targetsString1, targetsString2].includes(item.chosenTargets[1])
//       )
//     ) {
//       return;
//     }
//     results.push({ chosenTargets, pathLengths });
//   };

//   const shortestPaths = listShortestPathsBetweenInterestingValves(setup);
//   const interestingValves = Object.keys(setup.valves).filter(
//     valveName => setup.valves[valveName].pressureToRelease > 0
//   );

//   const _recursion = ({ chosenTargets, pathLengths }) => {
//     if (pathLengths[0] >= 26 && pathLengths[1] >= 26) {
//       _memorize(chosenTargets, pathLengths);
//       return;
//     }

//     if (chosenTargets[0].length + chosenTargets[1].length >= interestingValves.length + 1) {
//       _memorize(chosenTargets, pathLengths);
//       return;
//     }

//     // const nextTargets = [];
//     // [0, 1].forEach(index => {
//     //
//     // interestingValves.forEach(target => {
//     //   if (target)
//     // })

//     interestingValves.forEach(target1 => {
//       if (chosenTargets[0].includes(target1) || chosenTargets[1].includes(target1)) {
//         return;
//       }
//       const start1 = chosenTargets[0][chosenTargets[0].length - 1];
//       const pathItem1 = shortestPaths.find(
//         item => [item.start, item.end].includes(start1) && [item.start, item.end].includes(target1)
//       );
//       if (!pathItem1) {
//         throw new Error("Can't find path-item");
//       }
//       const path1 = pathItem1.start === start1 ? pathItem1?.forwards : pathItem1?.backwards;
//       interestingValves.forEach(target2 => {
//         if (target1 === target2 || chosenTargets[0].includes(target2) || chosenTargets[1].includes(target2)) {
//           return;
//         }
//         const start2 = chosenTargets[1][chosenTargets[1].length - 1];
//         const pathItem2 = shortestPaths.find(
//           item => [item.start, item.end].includes(start2) && [item.start, item.end].includes(target2)
//         );
//         if (!pathItem2) {
//           throw new Error("Can't find path-item");
//         }
//         const path2 = pathItem2.start === start2 ? pathItem2?.forwards : pathItem2?.backwards;
//         _recursion({
//           chosenTargets: [
//             [...chosenTargets[0], target1],
//             [...chosenTargets[1], target2],
//           ],
//           pathLengths: [pathLengths[0] + path1.length, pathLengths[1] + path2.length],
//         });
//       });
//       // });
//     });
//   };

//   _recursion({ chosenTargets: [["AA"], ["AA"]], pathLengths: [0, 0] });

//   return results;
// }

// /** @param {SETUP} setup */
// function yieldPossiblePathsWithHelpingElephant(setup, yieldCallback) {
//   let isRunning = true;

//   const _memorize = (chosenTargets, pathLengths) => {
//     // const targetsString1 = chosenTargets[0].join("-");
//     // const targetsString2 = chosenTargets[1].join("-");
//     // if (chosenTargets[0][1] < chosenTargets[1][1]) {
//     const result = yieldCallback({ chosenTargets, pathLengths });
//     if (!result) {
//       isRunning = false;
//     }
//     // }
//     return;
//   };

//   const shortestPaths = listShortestPathsBetweenInterestingValves(setup);
//   const interestingValves = Object.keys(setup.valves).filter(
//     valveName => setup.valves[valveName].pressureToRelease > 0
//   );

//   const _recursion = ({ chosenTargets, pathLengths }) => {
//     if (!isRunning) {
//       return;
//     }

//     if (chosenTargets[0][1] && chosenTargets[1][1] && chosenTargets[0][1] >= chosenTargets[1][1]) {
//       return;
//     }

//     if (pathLengths[0] >= 26 && pathLengths[1] >= 26) {
//       _memorize(chosenTargets, pathLengths);
//       return;
//     }

//     if (chosenTargets[0].length + chosenTargets[1].length >= interestingValves.length + 1) {
//       _memorize(chosenTargets, pathLengths);
//       return;
//     }

//     interestingValves.forEach(target1 => {
//       if (chosenTargets[0].includes(target1) || chosenTargets[1].includes(target1)) {
//         return;
//       }
//       const start1 = chosenTargets[0][chosenTargets[0].length - 1];
//       const pathItem1 = shortestPaths.find(
//         item => [item.start, item.end].includes(start1) && [item.start, item.end].includes(target1)
//       );
//       if (!pathItem1) {
//         throw new Error("Can't find path-item");
//       }
//       const path1 = pathItem1.start === start1 ? pathItem1?.forwards : pathItem1?.backwards;
//       interestingValves.forEach(target2 => {
//         if (target1 === target2 || chosenTargets[0].includes(target2) || chosenTargets[1].includes(target2)) {
//           return;
//         }
//         const start2 = chosenTargets[1][chosenTargets[1].length - 1];
//         const pathItem2 = shortestPaths.find(
//           item => [item.start, item.end].includes(start2) && [item.start, item.end].includes(target2)
//         );
//         if (!pathItem2) {
//           throw new Error("Can't find path-item");
//         }
//         const path2 = pathItem2.start === start2 ? pathItem2?.forwards : pathItem2?.backwards;
//         _recursion({
//           chosenTargets: [
//             [...chosenTargets[0], target1],
//             [...chosenTargets[1], target2],
//           ],
//           pathLengths: [pathLengths[0] + path1.length, pathLengths[1] + path2.length],
//         });
//       });
//       // });
//     });
//   };

//   _recursion({ chosenTargets: [["AA"], ["AA"]], pathLengths: [0, 0] });
// }

// function yieldCombinedPaths({ setup, maxPathLength, yieldCallback }) {
//   const shortestPaths = listShortestPathsBetweenInterestingValves(setup);

//   let isRunning = true;

//   const _yieldBothPaths = (item1, item2) => {
//     if (!yieldCallback({ item1, item2 })) {
//       isRunning = false;
//     }
//     return true;
//   };

//   const _yieldFirstPath = item1 => {
//     yieldPossiblePaths({
//       shortestPaths,
//       setup,
//       maxPathLength,
//       valvesToIgnore: item1.targets,
//       yieldCallback: item2 => _yieldBothPaths(item1, item2),
//       yieldsShorterPaths: false,
//     });
//     return isRunning;
//   };

//   yieldPossiblePaths({
//     shortestPaths,
//     setup,
//     maxPathLength,
//     valvesToIgnore: [],
//     yieldCallback: _yieldFirstPath,
//     yieldsShorterPaths: true,
//   });
// }

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
  // getMaxPressureToReleaseWithHelpingElephant,
  // getMaxPressureToReleaseWithHelpingElephantAndAiming,
  findShortestPath,
  listShortestPathsBetweenInterestingValves,
  // listPossiblePathsWithHelpingElephant,
  // yieldPossiblePathsWithHelpingElephant,
  yieldPossiblePaths,
  // yieldCombinedPaths,
  getReleasedPressureOnPath,
  getMaxPressureToReleasePart2,
};
