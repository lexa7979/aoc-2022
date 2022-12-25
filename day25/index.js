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

  mapIntoDecimals,
  getSnafu,
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
  const decimals = mapIntoDecimals(setup, handleLogEvent);
  const sum = decimals.reduce((acc, curr) => acc + curr, 0);
  return getSnafu(sum);
}

function getSolutionPart2(handleLogEvent) {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
}

/**
 * @typedef SETUP
 * @property {string[]} snafuNumbers
 */

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {SETUP} */
  const setup = { snafuNumbers: [] };

  lines.forEach((line, y) => {
    if (line) {
      setup.snafuNumbers.push(line);
    }
  });

  return setup;
}

/** @param {SETUP} setup */
/** @param {Function | null} handleLogEvent */
function mapIntoDecimals(setup, handleLogEvent) {
  const results = [];
  const progress = new Helpers.Progress({ handleLogEvent }).init(100);

  setup.snafuNumbers.forEach(snafu => {
    progress.step();

    let decimal = 0;
    for (let i = 0; i < snafu.length; i++) {
      const pow = Math.pow(5, snafu.length - i - 1);
      decimal += pow * { 2: 2, 1: 1, 0: 0, "-": -1, "=": -2 }[snafu[i]];
    }
    results.push(decimal);
  });

  progress.finalize();
  return results;
}

/** @param {number} decimal */
function getSnafu(decimal) {
  let snafu = "";

  const _getRangeByExponent = exponent => {
    const max =
      exponent >= 0 ? Helpers.getArrayRange(0, exponent).reduce((acc, curr) => acc + 2 * Math.pow(5, curr), 0) : 0;
    return [-max, max];
  };
  const _isInRange = (number, range) => number >= range[0] && number <= range[1];

  let maxExponent = 0;
  while (!_isInRange(decimal, _getRangeByExponent(maxExponent))) {
    maxExponent++;
  }

  let number = decimal;
  for (let exponent = maxExponent; exponent >= 0; exponent--) {
    const nextRange = _getRangeByExponent(exponent - 1);
    let nextNumber = null;

    for (let factor = -2; factor <= 2; factor++) {
      const n = number - factor * Math.pow(5, exponent);
      if (_isInRange(n, nextRange)) {
        snafu += { "-2": "=", "-1": "-" }[factor] || String(factor);
        nextNumber = n;
      }
    }

    if (nextNumber == null) {
      throw new Error("Conversion failed");
    }
    number = nextNumber;
  }

  return snafu;
}

/** @param {SETUP} setup */
/** @param {Function | null} handleLogEvent * /
function placeholder(setup, handleLogEvent) {
  const results = [];
  const progress = new Helpers.Progress({ handleLogEvent }).init(100);

  progress.finalize();
  return results;
}

/**/
