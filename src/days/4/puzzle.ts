type Card = {
  cardNum: number;
  winningNumbers: Array<string>;
  myNumbers: Array<string>;
};
const mapCard = (line: string): Card => {
  const numbers = line.substring(line.indexOf(':') + 1).split('|');
  return {
    cardNum: Number(line.substring(5, line.indexOf(':'))),
    // line,
    winningNumbers: numbers[0]
      .trim()
      .split(' ')
      .filter((t) => t.length > 0),
    myNumbers: numbers[1]
      .trim()
      .split(' ')
      .filter((t) => t.length > 0),
  };
};

const getNumberOfMatches = (card: Card) =>
  card.myNumbers.filter((myNumber) => card.winningNumbers.includes(myNumber))
    .length;

const mapMatchesOfLine = (line: string) => getNumberOfMatches(mapCard(line));
const sumNumbers = (agg: number, next: number) => agg + next;

export const solveFirst = (input: string): string => {
  const cardMatches = input.split('\n').map(mapMatchesOfLine);
  const totalCardPoints = cardMatches
    .map((t) => (t > 1 ? Math.pow(2, t - 1) : t))
    .reduce(sumNumbers, 0);

  return `solution 1 for input :\n${totalCardPoints}`;
};

export const solveSecond = (input: string): string => {
  const cards = input.split('\n').map(mapCard);
  const cardMatches = cards.map((card) => ({
    cardNum: card.cardNum,
    matches: getNumberOfMatches(card),
  }));
  const totalCardInstances = cardMatches
    .reduce(
      (totalCards, card, currIndex) =>
        totalCards.map((numberOfInstances, cardIndex) =>
          cardIndex > currIndex && cardIndex <= currIndex + card.matches
            ? numberOfInstances + totalCards[currIndex]
            : numberOfInstances
        ),
      Array.from(new Array(cards.length)).map((t) => 1)
    )
    .reduce(sumNumbers, 0);
  return `solution 2 for input :\n${totalCardInstances}`;
};
