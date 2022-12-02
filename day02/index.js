// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: /([ABC]) ([XYZ])/,
  asInteger: false,
});

const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";

const WIN = "win";
const LOSE = "lose";
const DRAW = "draw";

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
  const setup = parseLinesIntoSetup(lines, false);
  const outcomes = calculateOutcomeOfRounds(setup);
  const sum = outcomes.reduce((acc, curr) => acc + curr, 0);
  return sum;
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, true);
  const outcomes = calculateOutcomeOfRounds(setup);
  const sum = outcomes.reduce((acc, curr) => acc + curr, 0);
  return sum;
}

function parseLinesIntoSetup(lines, isSecondSetup) {
  /** @type {{ rounds: Array<Array> }} */
  const setup = { rounds: [] };

  const _getRockPaperScissors = letter => ({ A: ROCK, B: PAPER, C: SCISSORS, X: ROCK, Y: PAPER, Z: SCISSORS }[letter]);
  const _getLoseDrawWin = letter => ({ X: LOSE, Y: DRAW, Z: WIN }[letter]);

  lines.forEach(line => {
    if (line) {
      const opponentSelection = _getRockPaperScissors(line[0]);

      let mySelection;
      if (isSecondSetup) {
        switch (_getLoseDrawWin(line[1])) {
          case WIN:
            mySelection = { [ROCK]: PAPER, [PAPER]: SCISSORS, [SCISSORS]: ROCK }[opponentSelection];
            break;
          case LOSE:
            mySelection = { [ROCK]: SCISSORS, [PAPER]: ROCK, [SCISSORS]: PAPER }[opponentSelection];
            break;
          case DRAW:
            mySelection = opponentSelection;
            break;
        }
      } else {
        mySelection = _getRockPaperScissors(line[1]);
      }

      setup.rounds.push([opponentSelection, mySelection]);
    }
  });

  return setup;
}

function calculateOutcomeOfRounds(setup) {
  const outcomes = [];

  setup.rounds.forEach(([opponentSelection, mySelection]) => {
    let points = { [ROCK]: 1, [PAPER]: 2, [SCISSORS]: 3 }[mySelection];
    if (opponentSelection === mySelection) {
      points += 3;
    } else if (opponentSelection === ROCK && mySelection === PAPER) {
      points += 6;
    } else if (opponentSelection === PAPER && mySelection === SCISSORS) {
      points += 6;
    } else if (opponentSelection === SCISSORS && mySelection === ROCK) {
      points += 6;
    }
    outcomes.push(points);
  });

  return outcomes;
}

module.exports = {
  getSolutionPart1,
  getSolutionPart2,

  parseLinesIntoSetup,
  calculateOutcomeOfRounds,
};
