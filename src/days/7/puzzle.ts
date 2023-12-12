enum HandType {
  FiveOfAKind = 'FiveOfAKind',
  FourOfAKind = 'FourOfAKind',
  FullHouse = 'FullHouse',
  ThreeOfAKind = 'ThreeOfAKind',
  TwoPair = 'TwoPair',
  OnePair = 'OnePair',
  HighCard = 'HighCard',
}
// 0 is highest power
const handTypesStrength = Array.from(Object.values(HandType)).reduce(
  (handTypes, handType, power) => {
    handTypes[handType] = power;
    return handTypes;
  },
  {} as Record<HandType, number>
);
const getCardStrength = (cardsSet: string) =>
  Array.from(cardsSet).reduce((cards, card, power) => {
    cards[card] = power;
    return cards;
  }, {} as Record<string, number>);
const cards = 'AKQJT98765432';
const cards2 = 'AKQT98765432J';
// 0 is highest power
const cardStrength = getCardStrength(cards);
const cardStrength2 = getCardStrength(cards2);
const loadHand = (line: string) => {
  const [hand, bid] = line.split(' ');
  return { hand, bid: Number(bid), cards: hand.split('') };
};
const countCards = (cards: Array<string>): Record<string, number> => {
  return cards.reduce((agg, next) => {
    if (agg[next] == null) {
      agg[next] = 1;
    } else {
      agg[next]++;
    }
    return agg;
  }, {} as Record<string, number>);
};
const getHandType = (hand: Record<string, number>): HandType => {
  if (Object.keys(hand).length === 1) {
    return HandType.FiveOfAKind;
  }
  if (Object.keys(hand).length === 5) {
    return HandType.HighCard;
  }
  const maxNumberOfSameCards = Math.max.apply(Math, Object.values(hand));
  if (maxNumberOfSameCards === 4) {
    return HandType.FourOfAKind;
  }
  if (maxNumberOfSameCards === 3) {
    return Object.keys(hand).length === 2
      ? HandType.FullHouse
      : HandType.ThreeOfAKind;
  }
  return Object.keys(hand).length === 3 ? HandType.TwoPair : HandType.OnePair;
};
const compareHighCard = (
  hand1Cards: string[],
  hand2Cards: string[],
  withJokersRule?: boolean
): number => {
  const currCardStrength = withJokersRule ? cardStrength2 : cardStrength;

  if (currCardStrength[hand1Cards[0]] === currCardStrength[hand2Cards[0]]) {
    if (hand1Cards.length === 1) {
      return 0;
    } else {
      return compareHighCard(
        hand1Cards.slice(1),
        hand2Cards.slice(1),
        withJokersRule
      );
    }
  }
  return currCardStrength[hand1Cards[0]] < currCardStrength[hand2Cards[0]]
    ? 1
    : -1;
};
const compareHands = (
  hand1: HandAnalysed,
  hand2: HandAnalysed,
  withJokersRule?: boolean
): number => {
  if (hand1.handType === hand2.handType) {
    return compareHighCard(hand1.cards, hand2.cards, withJokersRule);
  }
  return handTypesStrength[hand1.handType] < handTypesStrength[hand2.handType]
    ? 1
    : -1;
};
const compareHandsWithJokersRule = (hand1: HandAnalysed, hand2: HandAnalysed) =>
  compareHands(hand1, hand2, true);
const applyJokersRule = (
  cardCount: Record<string, number>
): Record<string, number> => {
  // If there's no jokers on hand, than return current count
  if (cardCount['J'] == null) {
    return cardCount;
  }

  // Otherwise add number of jokers to the card with max count
  const mostRepeatedCard = Object.keys(cardCount).reduce(
    (bestKey, nextKey) =>
      (bestKey.length === 0 || cardCount[nextKey] > cardCount[bestKey]) &&
      nextKey !== 'J'
        ? nextKey
        : bestKey,
    ''
  );
  console.log('mostRepeatedCard: ', mostRepeatedCard, cardCount);
  const { J, ...rest } = cardCount;
  return {
    ...rest,
    [mostRepeatedCard]: cardCount[mostRepeatedCard] + cardCount['J'],
  };
};
const analyseHand = (handLine: string, withJokersRule?: boolean) => {
  const hand = loadHand(handLine);
  const cardCount = countCards(hand.cards);
  const newCardCount = withJokersRule ? applyJokersRule(cardCount) : cardCount;
  const handType = getHandType(newCardCount);
  return { ...hand, cardCount: newCardCount, handType };
};
type HandAnalysed = ReturnType<typeof analyseHand>;
const sumNumbers = (agg: number, next: number) => agg + next;
export const solveFirst = (input: string): string => {
  const hands = input.split('\r\n').map((line) => analyseHand(line));
  hands.sort(compareHands);
  const result = hands
    .map((hand, i) => hand.bid * (i + 1))
    .reduce(sumNumbers, 0);
  return `solution 1 for input :\n${result}`;
};

export const solveSecond = (input: string): string => {
  const hands = input.split('\r\n').map((line) => analyseHand(line, true));
  hands.sort(compareHandsWithJokersRule);
  const result = hands
    .map((hand, i) => hand.bid * (i + 1))
    .reduce(sumNumbers, 0);
  return `solution 2 for input :\n${result}`;
};
