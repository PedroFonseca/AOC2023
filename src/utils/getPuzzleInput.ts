import readFile from './readFile';

export default async (puzzleName: string, secondInput?: boolean) => {
  const puzzlePath = `src/days/${puzzleName}`;
  try {
    return await readFile(
      `${puzzlePath}/${secondInput ? 'input2' : 'input1'}.txt`
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
