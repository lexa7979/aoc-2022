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
  const steps = getFewestStepsWithDijkstra(setup);
  return steps;
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const steps = getFewestStepsFromDifferentStartPositions(setup);
  return steps;
}

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {{ area: Array<object>, currPos: object, bestSignalPos: object }} */
  const setup = { area: [], currPos: {}, bestSignalPos: {} };

  lines.forEach(line => {
    if (line) {
      const _turnCharIntoAltitude = (char, currCol) => {
        if (char === "S") {
          setup.currPos = { x: currCol, y: setup.area.length };
          return 0;
        }
        if (char === "E") {
          setup.bestSignalPos = { x: currCol, y: setup.area.length };
          return 25;
        }
        return char.charCodeAt(0) - "a".charCodeAt(0);
      };

      if (isPartOne) {
        setup.area.push(line.split("").map(_turnCharIntoAltitude));
      } else {
        setup.area.push(line.slice(0).split("").map(_turnCharIntoAltitude));
      }
    }
  });

  return setup;
}

/**
 * @param {{ area: Array<object>, currPos: {x:number, y:number}, bestSignalPos: {x:number, y:number} }} setup
 * @param {{x:number, y:number} | null} startPos
 */
function getFewestStepsWithDijkstra(setup, startPos = null) {
  const sizeX = setup.area[0].length;
  const sizeY = setup.area.length;

  const allNodes = setup.area.map((row, y) =>
    row.map((altitude, x) => ({ x, y, altitude, done: false, steps: Number.MAX_VALUE }))
  );

  if (!startPos) {
    allNodes[setup.currPos.y][setup.currPos.x].steps = 0;
  } else {
    allNodes[startPos.y][startPos.x].steps = 0;
  }

  // console.log(allNodes);

  // Determine which node has to lowest score, right now:
  const _getCurrNode = () => {
    let result = null;
    let fewestSteps = Number.MAX_VALUE;
    for (let y = 0; y < sizeY; y++) {
      for (let x = 0; x < sizeX; x++) {
        const item = allNodes[y][x];
        if (!item.done && item.steps < fewestSteps) {
          fewestSteps = item.steps;
          result = item;
        }
      }
    }
    if (result) {
      allNodes[result.y][result.x].done = true;
    }
    return result;
  };

  const _getNeighborCoordinates = (x, y) =>
    [
      y + 1 < sizeY ? [x, y + 1] : null,
      x + 1 < sizeX ? [x + 1, y] : null,
      y > 0 ? [x, y - 1] : null,
      x > 0 ? [x - 1, y] : null,
    ].filter(item => item != null);

  const _getNeighbors = item => {
    const coordinates = _getNeighborCoordinates(item.x, item.y);
    // @ts-ignore
    const allNeighbors = coordinates.map(([x, y]) => allNodes[y][x]);
    return allNeighbors.filter(item2 => !item2.done);
  };

  const _showNodes = () => {
    let output = "\n";
    for (let y = 0; y < sizeY; y++) {
      for (let x = 0; x < sizeX; x++) {
        const item = allNodes[y][x];
        if (item.steps < Number.MAX_VALUE) {
          output += item.done
            ? `(${String(item.steps).padStart(3, " ")}) `
            : ` ${String(item.steps).padStart(3, " ")}  `;
        } else {
          output += " ...  ";
        }
      }
      output += "\n";
    }
    return output;
  };

  for (let i = 0; i < sizeX * sizeY; i++) {
    const node = _getCurrNode();
    _getNeighbors(node).forEach(neighbor => {
      const stepCost = neighbor.altitude - node.altitude <= 1 ? 1 : 7900000;
      const newPathLength = node.steps + stepCost;
      const oldPathLength = neighbor.steps;
      if (newPathLength < oldPathLength) {
        neighbor.steps = newPathLength;
      }
    });
    // if (i % 1000 === 79) {
    //   console.log(i);
    // }
  }

  // console.log(_showNodes());

  return allNodes[setup.bestSignalPos.y][setup.bestSignalPos.x].steps;
}

function listStartPositions(setup) {
  const results = [];

  setup.area.forEach((row, y) => {
    row.forEach((altitude, x) => {
      if (altitude === 0) {
        results.push({ x, y });
      }
    });
  });

  return results;
}

function getFewestStepsFromDifferentStartPositions(setup) {
  let result = Number.MAX_VALUE;

  listStartPositions(setup).map((startPos, index) => {
    const steps = getFewestStepsWithDijkstra(setup, startPos);
    if (steps < result) {
      console.log(index, startPos, steps);
      result = steps;
    }
    // if (index % 100 === 7) {
    //   console.log(index, steps, result);
    // }
    return result;
  });

  return result;
}

function placeholder3(setup) {
  const results = [];

  return results;
}

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
  getFewestStepsWithDijkstra,
  listStartPositions,
  getFewestStepsFromDifferentStartPositions,
  placeholder3,
};
