const readMap = (input: string) => {
  const map = input.split('\r\n\r\n');

  return {
    instructions: Array.from(map[0]).map((dir) => (dir === 'L' ? 0 : 1)),
    coordinates: map[1].split('\r\n').reduce((agg, line) => {
      const r = line.split(' = ');
      return {
        ...agg,
        [r[0]]: r[1].replace('(', '').replace(')', '').split(', '),
      };
    }, {} as Record<string, string>),
  };
};

export const solveFirst = (input: string): string => {
  const map = readMap(input);
  let currentLoc = 'AAA';
  let steps = 0;
  do {
    for (let i = 0; i < map.instructions.length; i++) {
      const currInstruction = map.instructions[i];
      currentLoc = map.coordinates[currentLoc][currInstruction];
      steps += 1;
      if (currentLoc === 'ZZZ') {
        break;
      }
    }
  } while (currentLoc !== 'ZZZ');
  return `solution 1 for input :\n${steps}`;
};

const isStartLoc = (loc: string) => loc[loc.length - 1] === 'A';
const isEndLoc = (loc: string) => loc[loc.length - 1] === 'Z';
export const solveSecond = (input: string): string => {
  const map = readMap(input);
  let currLocations = Object.keys(map.coordinates).filter(isStartLoc);
  let solutions = currLocations.map((startLoc, i) => ({
    startLoc,
    i,
    solutions: [] as Array<number>,
  }));
  let steps = 0;
  const isFinishCondition = (locs: string[]) => locs.every(isEndLoc);
  do {
    for (let i = 0; i < map.instructions.length; i++) {
      const currInstruction = map.instructions[i];
      currLocations = currLocations.map(
        (currentLoc) => map.coordinates[currentLoc][currInstruction]
      );
      steps += 1;

      // update solutions array
      currLocations.forEach((loc, i) => {
        if (isEndLoc(loc)) {
          solutions[i].solutions.push(steps);
        }
      });
    }
  } while (!solutions.every((sol) => sol.solutions.length > 0));
  // } while (!isFinishCondition(currLocations));
  const result = solutions.map((t) => t.solutions[0]).reduce(lcm);
  return `solution 2 for input :\n${result}`;
};

// Euclid algorithm for Greates Common Divisor
function gcd(a: number, b: number): number {
  return !b ? a : gcd(b, a % b);
}

// Least Common Multiple function
function lcm(a: number, b: number): number {
  return a * (b / gcd(a, b));
}
