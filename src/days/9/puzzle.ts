const importSequences = (input: string) =>
  input.split('\r\n').map((t): number[] => t.split(' ').map((n) => Number(n)));
const diffSequence = (nums: number[]) =>
  nums.slice(1).map((num, i) => num - nums[i]);
const isSequenceSolved = (nums: number[]) =>
  nums.every((num) => num === nums[0]);
const solveSequence1 = (nums: number[]): number => {
  if (isSequenceSolved(nums)) {
    return nums[0];
  }
  const diff = diffSequence(nums);
  const increment = solveSequence1(diff);
  return nums[nums.length - 1] + increment;
};
const solveSequence2 = (nums: number[]): number => {
  if (isSequenceSolved(nums)) {
    return nums[0];
  }
  const diff = diffSequence(nums);
  const increment = solveSequence2(diff);
  return nums[0] - increment;
};
const sumNumbers = (agg: number, next: number) => agg + next;
export const solveFirst = (input: string): string => {
  const sequences = importSequences(input);
  const result = sequences.map(solveSequence1).reduce(sumNumbers, 0);
  return `solution 1 for input :\n${result}`;
};

export const solveSecond = (input: string): string => {
  const sequences = importSequences(input);
  const result = sequences.map(solveSequence2).reduce(sumNumbers, 0);
  return `solution 2 for input :\n${result}`;
};
