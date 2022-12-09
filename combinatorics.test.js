const Import = require("./combinatorics");

describe("Combinatorics", () => {
  const { Combinatorics } = Import;

  describe("can generate permutations in a way that", () => {
    it("- when used with an array of three unique numbers - works as expected", () => {
      const elements = [1, 2, 3];
      const combinatorics = new Combinatorics({ elements });

      const results = [];
      while (combinatorics.hasMoreResults()) {
        results.push(combinatorics.getNextResult());
      }

      expect(results.length).toBe(3 * 2 * 1);
      expect(results).toEqual([
        [1, 2, 3],
        [1, 3, 2],
        [2, 1, 3],
        [2, 3, 1],
        [3, 1, 2],
        [3, 2, 1],
      ]);
    });

    it("- when used with an array of four unique letters - works as expected", () => {
      const elements = ["l", "e", "x", "A"];
      const combinatorics = new Combinatorics({ elements });

      const results = [];
      while (combinatorics.hasMoreResults()) {
        results.push(combinatorics.getNextResult());
      }

      expect(results.length).toBe(4 * 3 * 2 * 1);
      expect(results).toEqual([
        ["l", "e", "x", "A"],
        ["l", "e", "A", "x"],
        ["l", "x", "e", "A"],
        ["l", "x", "A", "e"],
        ["l", "A", "e", "x"],
        ["l", "A", "x", "e"],
        ["e", "l", "x", "A"],
        ["e", "l", "A", "x"],
        ["e", "x", "l", "A"],
        ["e", "x", "A", "l"],
        ["e", "A", "l", "x"],
        ["e", "A", "x", "l"],
        ["x", "l", "e", "A"],
        ["x", "l", "A", "e"],
        ["x", "e", "l", "A"],
        ["x", "e", "A", "l"],
        ["x", "A", "l", "e"],
        ["x", "A", "e", "l"],
        ["A", "l", "e", "x"],
        ["A", "l", "x", "e"],
        ["A", "e", "l", "x"],
        ["A", "e", "x", "l"],
        ["A", "x", "l", "e"],
        ["A", "x", "e", "l"],
      ]);
    });

    it.only("- when used with an array of four non-unique letters - works as expected", () => {
      const elements = ["o", "t", "t", "o"];
      const combinatorics = new Combinatorics({ elements });

      const results = [];
      // while (combinatorics.hasMoreResults()) {
      //   results.push(combinatorics.getNextResult());
      // }
      results.push(combinatorics._getNthPermutationWithRepetition(1));

      // expect(combinatorics._getNumberOfPermutations([3, 3], 6)).toBe(5 * 4);

      // expect(results.length).toBe((4 * 3 * 2 * 1) / 2 / 2);
      expect(results).toMatchInlineSnapshot(`
[
  null,
]
`);
    });
  });
});
