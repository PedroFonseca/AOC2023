const mapGame = (line: string) => ({
  gameNum: Number(line.substring(5, line.indexOf(':'))),
  line,
  rounds: line
    .substring(line.indexOf(':') + 1)
    .split(';')
    .map((gameLine) =>
      gameLine.split(',').reduce(
        (agg, round) => {
          const str = round.trim();
          const ri = str.indexOf(' red');
          if (ri >= 0) {
            return { ...agg, r: Number(str.substring(0, ri)) };
          }
          const rg = str.indexOf(' green');
          if (rg >= 0) {
            return { ...agg, g: Number(str.substring(0, rg)) };
          }
          const rb = str.indexOf(' blue');
          if (rb >= 0) {
            return { ...agg, b: Number(str.substring(0, rb)) };
          }
        },
        { r: 0, g: 0, b: 0 }
      )
    ),
});
const sumNumbers = (agg: number, next: number) => agg + next;

export const solveFirst = (input: string): string => {
  const games = input.split('\n').map(mapGame);
  const notPossibleGames = games
    .filter(
      (game) =>
        !game.rounds.some(
          (round) => round.r > 12 || round.g > 13 || round.b > 14
        )
    )
    .map((game) => game.gameNum);
  const solution = notPossibleGames.reduce(sumNumbers, 0);
  return `solution 1 for input :\n${solution}`;
  // Solutions:
};

export const solveSecond = (input: string): string => {
  const games = input.split('\n').map(mapGame);
  const gamePowers = games.map((game) => {
    const minCubes = game.rounds.reduce(
      (agg, round) => ({
        r: Math.max(agg.r, round.r),
        g: Math.max(agg.g, round.g),
        b: Math.max(agg.b, round.b),
      }),
      {
        r: 0,
        g: 0,
        b: 0,
      }
    );
    return {
      ...minCubes,
      power: (minCubes.r || 1) * (minCubes.g || 1) * (minCubes.b || 1),
    };
  });
  const totalGamePower = gamePowers.map((t) => t.power).reduce(sumNumbers, 0);

  return `solution 2 for input :\n${totalGamePower}`;
  // Solutions:
};
