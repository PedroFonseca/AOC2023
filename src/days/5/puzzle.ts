type Mapper = {
  destRangeStart: number;
  sourceRangeStart: number;
  rangeLength: number;
};

const getSeeds = (seedsLine: string) =>
  seedsLine
    .substring(7)
    .split(' ')
    .map((num) => Number(num));

const getMap = (mapSection: string) =>
  mapSection
    .split('\r\n')
    .slice(1)
    .map((mapLine): Mapper => {
      const [destRangeStart, sourceRangeStart, rangeLength] =
        mapLine.split(' ');
      return {
        destRangeStart: Number(destRangeStart),
        sourceRangeStart: Number(sourceRangeStart),
        rangeLength: Number(rangeLength),
      };
    });

const convertUsingMap = (map: Array<Mapper>, num: number) => {
  const correctMap = map.find(
    (mapper) =>
      num >= mapper.sourceRangeStart &&
      num < mapper.sourceRangeStart + mapper.rangeLength
  );
  if (correctMap == null) {
    return num;
  }
  const difference = num - correctMap.sourceRangeStart;
  return correctMap.destRangeStart + difference;
};
const convertSeedThroghMaps = (seed: number, maps: Array<Array<Mapper>>) =>
  maps.reduce(
    (numToConvert, nextMapper) => convertUsingMap(nextMapper, numToConvert),
    seed
  );

export const solveFirst = (input: string): string => {
  const sections = input.split('\r\n\r\n');
  const seeds = getSeeds(sections[0]);
  const maps = sections.slice(1).map(getMap);
  const locations = seeds.map((seed) => convertSeedThroghMaps(seed, maps));
  const smallerLocation = Math.min.apply(Math, locations);
  return `solution 1 for input :\n${smallerLocation}`;
};

function* splitIntoPairs(array: number[]) {
  for (let i = 0; i < array.length; i += 2) {
    yield array.slice(i, i + 2);
  }
}

export const solveSecond = (input: string): string => {
  const sections = input.split('\r\n\r\n');
  const seeds = getSeeds(sections[0]);
  const maps = sections.slice(1).map(getMap);
  // const newSeeds = Array.from(splitIntoPairs(seeds)).map(([start, length]) =>
  //   Array.from(new Array(length), (a, i) => start + i)
  // );
  // const locations = newSeeds.map((seed) => convertSeedThroghMaps(seed, maps));
  // const smallerLocation = Math.min.apply(Math, locations);

  let smallerLocation = undefined as number | undefined;
  Array.from(splitIntoPairs(seeds)).forEach(([start, length], i) => {
    // console.log('processing seeds: ', i, start, length);
    for (let i = 0; i < length; i++) {
      const loc = convertSeedThroghMaps(start + i, maps);
      if (smallerLocation == undefined || loc < smallerLocation) {
        smallerLocation = loc;
        // console.log('smaller loc: ', loc);
      }
    }
  });

  return `solution 2 for input :\n${smallerLocation}`;
};
