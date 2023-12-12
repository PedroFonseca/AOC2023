const isNumericChar = (value: string) => /^\d$/.test(value);

type CharGroup = {
  numberStr: string;
  x: number;
  isSymbol: boolean;
};
const readLine = (line: string) => {
  const lineGroupsAgg = Array.from(line.replace('\r', '')).reduce(
    (agg, char, charIndex) => {
      if (isNumericChar(char)) {
        if (agg.currGroup === undefined) {
          // create new group if it doesn't exist yet
          return {
            ...agg,
            currGroup: { numberStr: char, x: charIndex, isSymbol: false },
          };
        } else {
          // otherwise add to existing number group
          return {
            ...agg,
            currGroup: {
              ...agg.currGroup,
              numberStr: agg.currGroup.numberStr + char,
            },
          };
        }
      } else {
        if (char === '.') {
          // If there is a current group then we need to end it here
          return {
            ...agg,
            groups: [...agg.groups, ...(agg.currGroup ? [agg.currGroup] : [])],
            currGroup: undefined,
          };
        } else {
          // We need to add a symbol group here (and if there is a current group also add it to the list)
          return {
            ...agg,
            groups: [
              ...agg.groups,
              ...(agg.currGroup ? [agg.currGroup] : []),
              { numberStr: char, isSymbol: true, x: charIndex },
            ],
            currGroup: undefined,
          };
        }
      }
    },
    {
      groups: [] as Array<CharGroup>,
      currGroup: undefined as CharGroup | undefined,
    }
  );
  // In case it ends in a group, we need to add that in as well
  return [
    ...lineGroupsAgg.groups,
    ...(lineGroupsAgg.currGroup != null ? [lineGroupsAgg.currGroup] : []),
  ];
};

const getPartNumbersOnLine = (
  prevLine: Array<CharGroup> | undefined,
  currLine: Array<CharGroup>,
  nextLine: Array<CharGroup> | undefined
) => {
  const adjacentLineSymbols = [
    ...(prevLine?.filter((t) => t.isSymbol) ?? []),
    ...currLine.filter((t) => t.isSymbol),
    ...(nextLine?.filter((t) => t.isSymbol) ?? []),
  ];
  // We will filter the current line groups for only the parts
  return currLine
    .filter((group) => {
      // If it's a symbol then it's never a not part group
      if (group.isSymbol) {
        return false;
      }
      // Group is a part if it is adjacent to any symbol group
      const isPart = adjacentLineSymbols.some(
        (g) => g.x >= group.x - 1 && g.x <= group.x + group.numberStr.length
      );
      console.log('checking', group.numberStr, isPart);
      // we return the number if it is not a part
      return isPart;
      // And finally we return the number that is not a part as a number
    })
    .map((group) => Number(group.numberStr));
};

const getEntinesOnLinePower = (
  prevLine: Array<CharGroup> | undefined,
  currLine: Array<CharGroup>,
  nextLine: Array<CharGroup> | undefined
): Array<number> => {
  const potentialEnginesOnLine = currLine.filter(
    (group) => group.numberStr === '*'
  );
  if (potentialEnginesOnLine.length <= 0) {
    return [];
  }

  const adjacentParts = [
    ...(prevLine?.filter((t) => !t.isSymbol) ?? []),
    ...currLine.filter((t) => !t.isSymbol),
    ...(nextLine?.filter((t) => !t.isSymbol) ?? []),
  ];
  // We will filter the current line groups for only the engines
  return potentialEnginesOnLine
    .map((potentialEngine) => {
      // Group is an engine if it is adjacent to at least two parts (non symbol groups)
      const potentialEngineParts = adjacentParts.filter(
        (part) =>
          part.x + part.numberStr.length >= potentialEngine.x &&
          part.x <= potentialEngine.x + 1
      );
      // we return the number if it is an engine otherwise return 0
      return potentialEngineParts.length === 2
        ? Number(potentialEngineParts[0].numberStr) *
            Number(potentialEngineParts[1].numberStr)
        : 0;
      // And finally we return the number that is not a part as a number
    })
    .filter((power) => power > 0);
};

const sumNumbers = (agg: number, next: number) => agg + next;
export const solveFirst = (input: string): string => {
  const lineGroups = input.split('\n').map(readLine);
  const partNumbers = lineGroups.flatMap((line, index) =>
    getPartNumbersOnLine(
      index === 0 ? undefined : lineGroups[index - 1],
      line,
      index === lineGroups.length - 1 ? undefined : lineGroups[index + 1]
    )
  );
  const result = partNumbers.reduce(sumNumbers, 0);
  // We need to check all lines
  return `solution 1 for input :\n${result}`;
};

export const solveSecond = (input: string): string => {
  const lineGroups = input.split('\n').map(readLine);
  // getEntinesOnLinePower(lineGroups[0], lineGroups[1], lineGroups[2]);
  const enginePowers = lineGroups.flatMap((line, index) =>
    getEntinesOnLinePower(
      index === 0 ? undefined : lineGroups[index - 1],
      line,
      index === lineGroups.length - 1 ? undefined : lineGroups[index + 1]
    )
  );
  const result = enginePowers.reduce(sumNumbers, 0);
  return `solution 2 for input :\n${result}`;
  // Solutions:
};
