type Race = { totalTime: number; bestDistance: number };

// for part one
const getRaces = (input: string): Array<Race> => {
  const lines = input.split('\r\n');
  const times = lines[0]
    .substring(6)
    .split(' ')
    .filter((t) => t.length > 0)
    .map((t) => Number(t));
  const distances = lines[1]
    .substring(10)
    .split(' ')
    .filter((t) => t.length > 0)
    .map((t) => Number(t));
  return times.map((totalTime, i) => ({
    totalTime,
    bestDistance: distances[i],
  }));
};
// For part two
const getRace = (input: string): Race => {
  const lines = input.split('\r\n');
  const totalTime = Number(lines[0].substring(6).replaceAll(' ', ''));
  const bestDistance = Number(lines[1].substring(10).replaceAll(' ', ''));
  return { totalTime, bestDistance };
};

//t is time pressing
//x is total miliseconds
//b is current distance record
// v = t
// dist = (x - t) * v = (x-t)*t
// isBestThanTime is dist > b => (x-t)*t > b
const isBestThanTime = (race: Race, timePressingButton: number) =>
  (race.totalTime - timePressingButton) * timePressingButton >
  race.bestDistance;

const getMarginOfError = (race: Race) => {
  let count = 0;
  for (let i = 1; i < race.totalTime; i++) {
    if (isBestThanTime(race, i)) {
      count++;
    }
  }
  return count;
};

const multNumbers = (agg: number, next: number) => agg * next;
export const solveFirst = (input: string): string => {
  const races = getRaces(input);
  const marginOfErrorPerRace = races.map(getMarginOfError);
  const result = marginOfErrorPerRace.reduce(multNumbers, 1);
  return `solution 1 for input :\n${result}`;
};

export const solveSecond = (input: string): string => {
  const race = getRace(input);
  const margin = getMarginOfError(race);
  return `solution 2 for input :\n${margin}`;
};
