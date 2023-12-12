const numbers = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];
// const replaceNumbers = line => numbers.reduce((agg, number) => {
//   return line.
// }, line)

const firstNumberOnLine = (line: string) =>
  numbers.reduce<{ index: number; num: number }>(
    (agg, numText, currNumIndex) => {
      const indexOfNumber = line.indexOf(numText);
      if (indexOfNumber >= 0 && (indexOfNumber < agg.index || agg.index < 0)) {
        return { index: indexOfNumber, num: currNumIndex };
      }
      return agg;
    },
    { index: -1, num: 0 }
  );
const lastNumberOnLine = (line: string) =>
  numbers.reduce<{ index: number; num: number }>(
    (agg, numText, currNumIndex) => {
      const indexOfNumber = line.lastIndexOf(numText);
      if (indexOfNumber >= 0 && (indexOfNumber > agg.index || agg.index < 0)) {
        return { index: indexOfNumber, num: currNumIndex };
      }
      return agg;
    },
    { index: -1, num: 0 }
  );
const replaceNumbersOnLine = (line: string) => {
  let updatedLine = line.concat('');
  const match1 = firstNumberOnLine(line);
  // inserts numbers before the numtext in the string
  if (match1.index >= 0) {
    updatedLine =
      updatedLine.substring(0, match1.index) +
      (match1.num + 1) +
      updatedLine.substring(match1.index);
  }
  const match2 = lastNumberOnLine(line);
  if (match2.index >= 0) {
    updatedLine =
      updatedLine.substring(0, match2.index + 1) +
      (match2.num + 1) +
      updatedLine.substring(match2.index + 1);
  }
  return updatedLine;
};
const getFirstAndLastNumbersConcat = (line: string) => {
  const numbers = Array.from(line)
    .filter((t) => Number(t))
    .join('');
  return Number(numbers[0].concat(numbers[numbers.length - 1]));
};
const sumNumbers = (agg: number, next: number) => agg + next;

export const solveFirst = (input: string): string =>
  input.split('\n').map(getFirstAndLastNumbersConcat).reduce(sumNumbers) + '';

export const solveSecond = (input: string): string =>
  input
    .split('\n')
    .map((line) => getFirstAndLastNumbersConcat(replaceNumbersOnLine(line)))
    .reduce(sumNumbers) + '';
