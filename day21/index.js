// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: null,
  asInteger: false,
  dontTrimInput: true,
});

module.exports = {
  getSolutionPart1,
  getSolutionPart2,
  parseLinesIntoSetup,

  getRootNumberToYell,
  getHumanNumberSoThatRootGetsEqualNumbers,
  // placeholder,
};

if (process.env.NODE_ENV !== "test") {
  console.log("Javascript");
  const part = process.env.part || "part1";
  if (part === "part1") {
    console.log(getSolutionPart1());
  } else {
    console.log(getSolutionPart2());
  }
}

function getSolutionPart1(handleLogEvent) {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, true);
  return getRootNumberToYell(setup, null, true);
}

function getSolutionPart2(handleLogEvent) {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  return getHumanNumberSoThatRootGetsEqualNumbers(setup);
}

/**
 * @typedef SETUP
 * @property {Array<MONKEY_SETUP>} monkeys
 */

/**
 * @typedef MONKEY_SETUP
 * @property {string} name
 * @property {number | null} [numberToYell]
 * @property {string | null} [operation]
 * @property {string | null} [leftArgMonkey]
 * @property {string | null} [rightArgMonkey]
 */

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { monkeys: [] };

  lines.forEach(line => {
    const match1 = /^(\w+): (\d+)$/.exec(line);
    const match2 = /^(\w+): (\w+) (\S) (\w+)$/.exec(line);
    if (match1) {
      setup.monkeys.push({
        name: match1[1],
        numberToYell: parseInt(match1[2], 10),
      });
    } else if (match2) {
      setup.monkeys.push({
        name: match2[1],
        numberToYell: null,
        operation: match2[3],
        leftArgMonkey: match2[2],
        rightArgMonkey: match2[4],
      });
    } else {
      throw new Error("Failed to parse line");
    }
  });

  return setup;
}

/** @param {SETUP} setup */
/** @param {number | null} humanNumber */
/** @param {boolean} isPartOne */
function getRootNumberToYell(setup, humanNumber, isPartOne) {
  const _recursion = currMonkeyName => {
    if (humanNumber != null && currMonkeyName === "humn") {
      return humanNumber;
    }

    const item = setup.monkeys.find(item => item.name === currMonkeyName);
    if (!item) {
      throw new Error(`Invalid monkey "${currMonkeyName}"`);
    }

    if (item.numberToYell != null) {
      return item.numberToYell;
    }

    const leftResult = _recursion(item.leftArgMonkey);
    const rightResult = _recursion(item.rightArgMonkey);

    if (!isPartOne && currMonkeyName === "root") {
      return leftResult - rightResult;
    }

    switch (item.operation) {
      case "+":
        return leftResult + rightResult;
      case "-":
        return leftResult - rightResult;
      case "*":
        return leftResult * rightResult;
      case "/":
        return leftResult / rightResult;
      default:
        throw new Error(`Invalid operation "${item.operation}"`);
    }
  };

  return _recursion("root");
}

/** @param {SETUP} setup */
function getHumanNumberSoThatRootGetsEqualNumbers(setup) {
  let min = Number.MIN_SAFE_INTEGER;
  let max = Number.MAX_SAFE_INTEGER;
  while (min + 1 < max) {
    const mid = min + Math.floor((max - min) / 2);

    const leftResult = getRootNumberToYell(setup, min, false);
    const midResult = getRootNumberToYell(setup, mid, false);
    const rightResult = getRootNumberToYell(setup, max, false);

    if (leftResult === 0) {
      return min;
    }
    if (midResult === 0) {
      return mid;
    }
    if (rightResult === 0) {
      return max;
    }

    if ((leftResult < 0 && midResult < 0 && rightResult > 0) || (leftResult > 0 && midResult > 0 && rightResult < 0)) {
      min = mid;
    } else if (
      (leftResult < 0 && midResult > 0 && rightResult > 0) ||
      (leftResult > 0 && midResult < 0 && rightResult < 0)
    ) {
      max = mid;
    } else {
      break;
    }
  }
}

/** @param {SETUP} setup */
/** @param {Function} handleLogEvent * /
function placeholder(setup, handleLogEvent) {
  const results = [];
  const progress = new Helpers.Progress({ handleLogEvent }).init(100);

  progress.finalize();
  return results;
}

/**/
