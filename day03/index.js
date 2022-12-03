// @ts-check

const Helpers = require("./helpers");

Helpers.setParseOptions({
  transformMatch: null,
  asInteger: false,
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
  const items = getDoubleItems(setup);
  const prios = getItemPriorities(items);
  const sum = prios.reduce((acc, curr) => acc + curr, 0);
  return sum;
}

function getSolutionPart2() {
  const lines = Helpers.parseInputData();
  const setup = parseLinesIntoSetup(lines, false);
  const items = getCommonItemFromEveryGroup(setup);
  const prios = getItemPriorities(items);
  const sum = prios.reduce((acc, curr) => acc + curr, 0);
  return sum;
}

function parseLinesIntoSetup(lines, isPartOne) {
  if (isPartOne) {
    /** @type {{ rucksacks: Array<Array> }} */
    const setup = { rucksacks: [] };
    lines.forEach(line => {
      if (line) {
        const itemsOfFirstCompartment = line.slice(0, line.length / 2);
        const itemsOfSecondCompartment = line.slice(line.length / 2);
        setup.rucksacks.push([itemsOfFirstCompartment, itemsOfSecondCompartment]);
      }
    });
    return setup;
  }

  /** @type {{ groups: Array<Array> }} */
  const setup = { groups: [] };
  let currGroup = [];
  lines.forEach(line => {
    if (line) {
      currGroup.push(line);
      if (currGroup.length === 3) {
        setup.groups.push(currGroup);
        currGroup = [];
      }
    }
  });
  return setup;
}

function getDoubleItems(setup) {
  const results = [];

  setup.rucksacks.forEach(([itemsOfFirstCompartment, itemsOfSecondCompartment]) => {
    for (let i = 0; i < itemsOfFirstCompartment.length; i++) {
      if (itemsOfSecondCompartment.includes(itemsOfFirstCompartment[i])) {
        results.push(itemsOfFirstCompartment[i]);
        break;
      }
    }
  });

  return results;
}

function getItemPriorities(items) {
  const results = [];

  const charCodes = { a: "a".charCodeAt(0), z: "z".charCodeAt(0), A: "A".charCodeAt(0), Z: "Z".charCodeAt(0) };

  items.forEach(letter => {
    const charCode = letter.charCodeAt(0);
    if (charCode >= charCodes.a && charCode <= charCodes.z) {
      results.push(charCode - charCodes.a + 1);
    } else {
      results.push(charCode - charCodes.A + 27);
    }
  });

  return results;
}

function getCommonItemFromEveryGroup(setup) {
  const results = [];

  setup.groups.forEach(group => {
    for (let i = 0; i < group[0].length; i++) {
      if (group[1].includes(group[0][i]) && group[2].includes(group[0][i])) {
        results.push(group[0][i]);
        break;
      }
    }
  });

  return results;
}

module.exports = {
  getSolutionPart1,
  getSolutionPart2,

  parseLinesIntoSetup,
  getDoubleItems,
  getItemPriorities,
  getCommonItemFromEveryGroup,
};
