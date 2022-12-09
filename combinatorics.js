const MODES = Object.freeze({
  PERMUTATION: "n-th permutation",
});

class Combinatorics {
  /**
   * @param {object} inputBag
   * @param {Array} inputBag.elements
   *  List of unique elements (e.g. [3, 5, 7, 9, "hello"])
   */
  constructor({ elements }) {
    if (!Array.isArray(elements) || elements.length === 0) {
      throw new Error('Invalid argument "elements"');
    }
    this.elements = elements;

    this.areUniqueElements = elements.every((item, index) => elements.indexOf(item) === index);

    this.uniqueElements = [];
    elements.forEach(value => {
      const obj = this.uniqueElements.find(item2 => item2.value === value);
      if (obj) {
        obj.count++;
      } else {
        this.uniqueElements.push({ value, count: 1 });
      }
    });

    this.mode = MODES.PERMUTATION;

    this.factorialMap = {};
    this.currIndex = 0;
    this.count = this.countResults();
  }

  _factorial(n) {
    const _recursion = n => (n > 1 ? n * _recursion(n - 1) : 1);
    if (!this.factorialMap[n]) {
      this.factorialMap[n] = _recursion(n);
    }
    return this.factorialMap[n];
  }

  countResults() {
    switch (this.mode) {
      case MODES.PERMUTATION: {
        if (this.areUniqueElements) {
          return this._factorial(this.elements.length);
        }
        let total = this._factorial(this.elements.length);
        this.uniqueElements.forEach(({ count }) => {
          total /= this._factorial(count);
        });
        return total;
      }
    }
    return 0;
  }

  hasMoreResults() {
    return this.currIndex < this.count;
  }

  getNextResult() {
    if (this.currIndex >= this.count) {
      return null;
    }

    let result;
    switch (this.mode) {
      case MODES.PERMUTATION:
        result = this.areUniqueElements
          ? this._getNthPermutation(this.currIndex)
          : this._getNthPermutationWithRepetition(this.currIndex);
    }

    this.currIndex++;
    return result;
  }

  /**
   * Calculates one permutation without repetition.
   *
   * You might want to use this function in a loop to get all permutations.
   *
   * @param {number} n
   *    e.g. 10
   *
   * @returns {Array | null}
   *  n-th permutation (e.g. [3, "hello", 9, 5, 7]); or
   *  null if there are less than n permutations
   */
  _getNthPermutation(n) {
    const _recursion = (n, remainingElements) => {
      const numberOfElements = remainingElements.length;
      if (numberOfElements === 0) {
        return [];
      }

      const numberOfPermutations = this._factorial(numberOfElements);
      if (n >= numberOfPermutations) {
        return null;
      }

      const indexOfFirstElement = Math.floor(n / (numberOfPermutations / numberOfElements));
      const otherElements = remainingElements.filter((key, index) => index !== indexOfFirstElement);

      const permutationOfOtherElements = _recursion(n % (numberOfPermutations / numberOfElements), otherElements);

      return permutationOfOtherElements
        ? [remainingElements[indexOfFirstElement], ...permutationOfOtherElements]
        : null;
    };

    return _recursion(n, this.elements);
  }

  _getNumberOfPermutations(listOfCounts, totalCount) {
    return listOfCounts.reduce((acc, curr) => acc / this._factorial(curr), this._factorial(totalCount));
  }

  /**
   * @param {*} n
   *
   * @returns
   */
  _getNthPermutationWithRepetition(n) {
    const _recursion = (n, remainingElements, remainingUniqueElements) => {
      console.log(n, remainingElements, remainingUniqueElements);

      const numberOfElements = remainingElements.length;
      const numberOfUniqueElements = remainingUniqueElements.length;
      if (numberOfUniqueElements === 0) {
        return [];
      }

      const numberOfPermutations = this._getNumberOfPermutations(
        remainingUniqueElements.map(({ count }) => count),
        numberOfElements
      );
      // const numberOfPermutations = remainingUniqueElements.reduce(
      //   (acc, curr) => acc / this._factorial(curr.count),
      //   this._factorial(numberOfElements)
      // );
      console.log(
        n,
        numberOfPermutations,
        numberOfUniqueElements,
        Math.floor(n / (numberOfPermutations / numberOfUniqueElements)),
        n % (numberOfPermutations / numberOfUniqueElements)
      );
      if (n >= numberOfPermutations) {
        return null;
      }

      const uniqueIndexOfFirstElement = Math.floor(n / (numberOfPermutations / numberOfUniqueElements));
      const firstElement = remainingUniqueElements[uniqueIndexOfFirstElement].value;
      const indexOfFirstElement = remainingElements.indexOf(firstElement);

      const otherElements = remainingElements.filter((_, index) => index !== indexOfFirstElement);
      const otherUniqueElements = remainingUniqueElements
        .map((item, index) => {
          if (index === uniqueIndexOfFirstElement) {
            return item.count > 1 ? { value: item.value, count: item.count - 1 } : null;
          }
          return item;
        })
        .filter(Boolean);

      const permutationOfOtherElements = _recursion(
        n % (numberOfPermutations / numberOfUniqueElements),
        otherElements,
        otherUniqueElements
      );

      return permutationOfOtherElements ? [firstElement, ...permutationOfOtherElements] : null;
    };

    return _recursion(n, this.elements, this.uniqueElements);
  }
}

function getNthPermutationOfElements(n, elements) {
  if (elements.length === 0) {
    return [];
  }

  const numberOfElements = elements.length;

  let factorial = 1;
  elements.forEach((_, index) => {
    factorial *= index + 1;
  });
  const numberOfPermutations = factorial;

  if (n >= numberOfPermutations) {
    return null;
  }

  const indexOfFirstElement = Math.floor(n / (numberOfPermutations / numberOfElements));
  const otherElements = elements.filter((key, index) => index !== indexOfFirstElement);

  const permutationOfOtherElements = getNthPermutationOfElements(
    n % (numberOfPermutations / numberOfElements),
    otherElements
  );

  return permutationOfOtherElements ? [elements[indexOfFirstElement], ...permutationOfOtherElements] : null;
}

module.exports = {
  Combinatorics,
};
