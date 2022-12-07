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
  const directorySizes = calculateDirectorySizes(setup);
  const smallDirectories = getSmallDirectories(directorySizes);
  const sum = smallDirectories.reduce((acc, curr) => acc + curr.totalSize, 0);
  return sum;
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const directorySizes = calculateDirectorySizes(setup);
  const size = getSizeOfSmallestDirectoryToReleaseEnoughDiscspace(directorySizes);
  return size;
}

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {{ files: Array<object> }} */
  const setup = { files: [] };

  let currPath = [];
  lines.forEach(line => {
    const matchCommands = /^\$ (\w+)( \S+)?$/.exec(line);
    if (matchCommands) {
      if (matchCommands[1] === "cd") {
        if (matchCommands[2] === " /") {
          currPath.splice(0);
        } else if (matchCommands[2] === " ..") {
          currPath.pop();
        } else {
          currPath.push(matchCommands[2].trim());
        }
      }
      return;
    }
    const matchFiles = /^(\d+) (\S+)$/.exec(line);
    if (matchFiles) {
      setup.files.push({
        path: currPath.join("/"),
        name: matchFiles[2],
        size: parseInt(matchFiles[1], 10),
      });
    }
  });

  return setup;
}

function calculateDirectorySizes(setup) {
  const results = {};

  setup.files.forEach(({ path, size }) => {
    if (path !== "") {
      const currPathList = path.split("/");
      for (let i = 0; i < currPathList.length; i++) {
        const path = currPathList.slice(0, i + 1).join("/");
        results[path] = (results[path] || 0) + size;
      }
    }
    results[""] = (results[""] || 0) + size;
  });

  return results;
}

function getSmallDirectories(directories) {
  const results = [];

  Object.entries(directories).forEach(([path, totalSize]) => {
    if (totalSize <= 100000) {
      results.push({ path, totalSize });
    }
  });

  return results;
}

function getSizeOfSmallestDirectoryToReleaseEnoughDiscspace(directories) {
  const freeSpaceBefore = 70000000 - directories[""];
  const neededSpaceAfter = 30000000;

  let currSize = null;
  Object.entries(directories).forEach(([path, totalSize]) => {
    if (freeSpaceBefore + totalSize >= neededSpaceAfter) {
      if (currSize === null || currSize > totalSize) {
        currSize = totalSize;
      }
    }
  });

  return currSize;
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
  calculateDirectorySizes,
  getSmallDirectories,
  getSizeOfSmallestDirectoryToReleaseEnoughDiscspace,
};
