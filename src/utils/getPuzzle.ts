import { PuzzleInterface } from '../types/PuzzleInterface';

export default async (puzzleName: string) => {
  return (await import(`../days/${puzzleName}/puzzle`)) as PuzzleInterface;
};
