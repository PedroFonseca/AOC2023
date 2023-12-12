const importMap = (input: string) =>
  input.split('\r\n').map((line) => Array.from(line));
type StarMap = ReturnType<typeof importMap>;
const getExpansionOfUniverse = (starMap: StarMap) => ({
  linesToExpand: starMap
    .map((line, index) => ({
      index,
      hasGalaxies: line.findIndex((t) => t === '#') >= 0,
    }))
    .filter((t) => !t.hasGalaxies)
    .map((t) => t.index),
  columnsToExpand: Array.from(new Array(starMap[0].length))
    .map((_, i) => {
      const col = starMap.map((t, j) => starMap[j][i]);
      return {
        index: i,
        hasGalaxies: col.findIndex((t) => t === '#') >= 0,
      };
    })
    .filter((t) => !t.hasGalaxies)
    .map((t) => t.index),
});
const expandGalaxy = (starMap: StarMap) => {
  const { linesToExpand, columnsToExpand } = getExpansionOfUniverse(starMap);
  linesToExpand.reverse();
  columnsToExpand.reverse();

  const newStarMap = starMap.map((line, y) => {
    const newLine = [...line];
    columnsToExpand.forEach((colIndex) => {
      newLine.splice(colIndex, 0, '.');
    });
    return newLine;
  });
  const emptyLine = Array.from(new Array(newStarMap.length)).map((_, i) => '.');
  linesToExpand.forEach((lineIndex) => {
    newStarMap.splice(lineIndex, 0, emptyLine);
  });

  return newStarMap;
};
const extractGalaxies = (starMap: StarMap) =>
  starMap
    .flatMap((line, y) => line.map((t, x) => ({ isGalaxy: t === '#', x, y })))
    .filter((t) => t.isGalaxy)
    .map(({ isGalaxy, ...rest }, i) => ({ ...rest, number: i }));
const extractGalaxiesWithExpansion = (starMap: StarMap) => {
  const expansionFactor = 1000000;
  const { linesToExpand, columnsToExpand } = getExpansionOfUniverse(starMap);
  const galaxies = extractGalaxies(starMap);
  // apply expansion of the galaxy
  return galaxies.map((galaxy) => ({
    ...galaxy,
    x:
      galaxy.x +
      columnsToExpand.filter((t) => t < galaxy.x).length *
        (expansionFactor - 1),
    y:
      galaxy.y +
      linesToExpand.filter((t) => t < galaxy.y).length * (expansionFactor - 1),
  }));
};
type Galaxy = ReturnType<typeof extractGalaxies>[0];
const countDistance = (galaxy1: Galaxy, galaxy2: Galaxy) =>
  Math.abs(galaxy2.x - galaxy1.x) + Math.abs(galaxy2.y - galaxy1.y);

const sumNumbers = (agg: number, next: number) => agg + next;
export const solveFirst = (input: string): string => {
  const starMap = expandGalaxy(importMap(input));
  const galaxies = extractGalaxies(starMap);
  const allGalaxyPairs = galaxies.flatMap((galaxy1, i) =>
    galaxies.slice(i + 1).map((galaxy2) => [galaxy1, galaxy2])
  );
  const result = allGalaxyPairs
    .map(([galaxy1, galaxy2]) => countDistance(galaxy1, galaxy2))
    .reduce(sumNumbers, 0);
  return `solution 1 for input :\n${result}`;
};

export const solveSecond = (input: string): string => {
  const starMap = importMap(input);
  const galaxies = extractGalaxiesWithExpansion(starMap);
  const allGalaxyPairs = galaxies.flatMap((galaxy1, i) =>
    galaxies.slice(i + 1).map((galaxy2) => [galaxy1, galaxy2])
  );
  const result = allGalaxyPairs
    .map(([galaxy1, galaxy2]) => countDistance(galaxy1, galaxy2))
    .reduce(sumNumbers, 0);
  return `solution 2 for input :\n${result}`;
};
