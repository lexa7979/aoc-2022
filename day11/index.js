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
  const rounds = playSeveralRounds(setup, 20, true);
  const inspectCountList = Object.values(rounds[rounds.length - 1].inspectCountByMonkey);
  inspectCountList.sort((a, b) => b - a);
  return inspectCountList[0] * inspectCountList[1];
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const rounds = playSeveralRounds(setup, 10000, false);
  const inspectCountList = Object.values(rounds[rounds.length - 1].inspectCountByMonkey);
  inspectCountList.sort((a, b) => b - a);
  return inspectCountList[0] * inspectCountList[1];
}

function parseLinesIntoSetup(lines, isPartOne) {
  /** @type {{ monkeys: Array<object>, dividers: Array<number> }} */
  const setup = { monkeys: [], dividers: [] };

  let currMonkey;
  lines.forEach(line => {
    const matches = {
      monkeyId: /Monkey (\d+):/.exec(line),
      startingItems: /Starting items: ([\d, ]+)/.exec(line),
      operation: /Operation: new = old (.) (\w+)/.exec(line),
      test: /Test: divisible by (\d+)/.exec(line),
      testAction: /If (\w+): throw to monkey (\d+)/.exec(line),
    };

    if (matches.monkeyId) {
      currMonkey = { id: parseInt(matches.monkeyId[1], 10) };
    } else if (matches.startingItems) {
      currMonkey.startingItems = matches.startingItems[1].split(", ").map(item => parseInt(item, 10));
    } else if (matches.operation) {
      currMonkey.operation = [
        matches.operation[1],
        matches.operation[2] === "old" ? "old" : parseInt(matches.operation[2], 10),
      ];
    } else if (matches.test) {
      const divisibleBy = parseInt(matches.test[1], 10);
      currMonkey.test = { divisibleBy };
      if (!setup.dividers.includes(divisibleBy)) {
        setup.dividers.push(divisibleBy);
      }
    } else if (matches.testAction) {
      if (matches.testAction[1] === "true") {
        currMonkey.test.ifTrueThrowToMonkey = parseInt(matches.testAction[2], 10);
      } else {
        currMonkey.test.ifFalseThrowToMonkey = parseInt(matches.testAction[2], 10);
      }
    } else if (!line) {
      setup.monkeys.push(currMonkey);
      currMonkey = null;
    }
  });

  if (currMonkey) {
    setup.monkeys.push(currMonkey);
    currMonkey = null;
  }

  return setup;
}

function playSeveralRounds(setup, numberOfRounds, isPartOne) {
  const resultsByRound = [];

  const lowestCommonDenominator = setup.dividers.reduce((acc, curr) => acc * curr, 1);

  const currRound = {
    itemsByMonkey: {},
    inspectCountByMonkey: {},
  };
  setup.monkeys.forEach(({ id, startingItems }) => {
    currRound.itemsByMonkey[id] = [...startingItems];
    currRound.inspectCountByMonkey[id] = 0;
  });

  for (let round = 0; round < numberOfRounds; round++) {
    Object.keys(currRound.itemsByMonkey).forEach(id => {
      const { operation, test } = setup.monkeys[id];

      const _runOperation = value => {
        if (operation[1] === "old") {
          return operation[0] === "*" ? value * value : value + value;
        }
        return operation[0] === "*" ? value * operation[1] : value + operation[1];
      };

      const _getNewMonkeyId = value => {
        const isDivisible = value % test.divisibleBy === 0;
        return isDivisible ? test.ifTrueThrowToMonkey : test.ifFalseThrowToMonkey;
      };

      const oldItems = [...currRound.itemsByMonkey[id]];
      currRound.itemsByMonkey[id] = [];

      oldItems.forEach(worryLevel => {
        currRound.inspectCountByMonkey[id]++;
        const newWorryLevel = isPartOne
          ? Math.floor(_runOperation(worryLevel) / 3)
          : _runOperation(worryLevel) % lowestCommonDenominator;
        const newId = _getNewMonkeyId(newWorryLevel);
        currRound.itemsByMonkey[newId].push(newWorryLevel);
      });
    });
    resultsByRound.push(JSON.parse(JSON.stringify(currRound)));
  }

  return resultsByRound;
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
  playSeveralRounds,
};
