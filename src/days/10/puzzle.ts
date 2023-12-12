const north = { id: 'n', coord: [0, -1] };
const south = { id: 's', coord: [0, 1] };
const west = { id: 'w', coord: [-1, 0] };
const east = { id: 'e', coord: [1, 0] };
const directions = { n: north, s: south, w: west, e: east };
type Direction = typeof north;
type DirectionCoord = Direction['coord'];
const connections = {
  '|': [north, south],
  '-': [west, east],
  L: [north, east],
  J: [north, west],
  '7': [south, west],
  F: [south, east],
} as Record<string, [Direction, Direction]>;
const endConnectionChars = Object.entries(connections)
  .filter(([_, value]) => value.find((t) => t.id === east.id) == null)
  .map(([key]) => key);
type Position = [number, number];
const importMap = (input: string) =>
  input.split('\r\n').map((line, y) =>
    Array.from(line).map((char, x) => ({
      char,
      pos: [x, y] as Position,
      id: `${x}_${y}`,
      isPartOfLoop: char === 'S',
      isInsidePipes: false,
      isStart: char === 'S',
    }))
  );
type Map = ReturnType<typeof importMap>;
type MapPosition = Map[0][0];
const getPosition = (map: Map, pos: Position) => map[pos[1]][pos[0]];
const isSafePosition = (pos: number, min: number, max: number) =>
  pos >= min && pos <= max;
const getPositionFromDirection = (
  map: Map,
  position: Position,
  direction: DirectionCoord
) => {
  const x = position[0] + direction[0];
  const y = position[1] + direction[1];
  // console.log(x, y, map.length, map[0].length);
  return isSafePosition(x, 0, map[0].length - 1) &&
    isSafePosition(y, 0, map.length - 1)
    ? getPosition(map, [x, y])
    : undefined;
};
const getConnectedStartPositions = (map: Map, pos: Position) => {
  const northPos = getPositionFromDirection(map, pos, north.coord);
  const southPos = getPositionFromDirection(map, pos, south.coord);
  const westPos = getPositionFromDirection(map, pos, west.coord);
  const eastPos = getPositionFromDirection(map, pos, east.coord);
  const isNorthPos =
    northPos != null &&
    connections[northPos.char]?.find((t) => t.id === 's') != null;
  const isSouthPos =
    southPos != null &&
    connections[southPos.char]?.find((t) => t.id === 'n') != null;
  const isWestPos =
    westPos != null &&
    connections[westPos.char]?.find((t) => t.id === 'e') != null;
  const isEastPos =
    eastPos != null &&
    connections[eastPos.char]?.find((t) => t.id === 'w') != null;
  const positions = [
    isNorthPos ? northPos : undefined,
    isSouthPos ? southPos : undefined,
    isWestPos ? westPos : undefined,
    isEastPos ? eastPos : undefined,
  ];
  let char = '.';
  if (isNorthPos && isSouthPos) {
    char = '|';
  } else if (isWestPos && isEastPos) {
    char = '-';
  } else if (isNorthPos && isEastPos) {
    char = 'L';
  } else if (isNorthPos && isWestPos) {
    char = 'J';
  } else if (isSouthPos && isWestPos) {
    char = '7';
  } else if (isSouthPos && isEastPos) {
    char = 'F';
  }
  return { connectedPositions: positions.filter((t) => t != null), char };
};
const getConnectedPositions = (map: Map, mapPosition: MapPosition) => {
  return connections[mapPosition.char].map((dir) => ({
    prevPosition: mapPosition,
    currPosition: getPositionFromDirection(map, mapPosition.pos, dir.coord),
  }));
};
const getNextPosition = (
  map: Map,
  mapPosition: MapPosition,
  prevPosition: MapPosition
) =>
  getConnectedPositions(map, mapPosition).filter(
    (t) => t.currPosition.id !== prevPosition.id
  );

export const solveFirst = (input: string): string => {
  const map = importMap(input);
  const flatMap = map.flatMap((t) => t);
  const startPosition = flatMap.find((t) => t.isStart);
  const startConnectedPositions = getConnectedStartPositions(
    map,
    startPosition.pos
  );
  let nextPositions = startConnectedPositions.connectedPositions.map(
    (currPosition) => ({ currPosition, prevPosition: startPosition })
  );
  let step = 1;
  const isFinishCondition = (positions: typeof nextPositions) =>
    positions[0].currPosition.id === positions[1].currPosition.id ||
    positions[0].currPosition.id === positions[1].prevPosition.id;

  while (!isFinishCondition(nextPositions)) {
    step++;
    nextPositions = nextPositions.flatMap((pos) =>
      getNextPosition(map, pos.currPosition, pos.prevPosition)
    );
  }
  return `solution 1 for input :\n${step}`;
};

type CardinalDirection = 'n' | 's' | 'e' | 'w';
// depending on the char, decide which is the inside direction
const getNextInsideDirection = (
  position: MapPosition,
  prevPosition: MapPosition,
  insideDirection: ['n' | 's', 'w' | 'e']
): ['n' | 's', 'w' | 'e'] => {
  switch (position.char) {
    case 'L':
      if (prevPosition.pos[0] > position.pos[0]) {
        // right turn
        return ['n', insideDirection[1] === 'e' ? 'w' : 'e'];
      } else {
        // left turn
        return [insideDirection[1] === 'e' ? 'n' : 's', 'e'];
      }
    case 'J':
      if (prevPosition.pos[0] < position.pos[0]) {
        // left turn
        return ['n', insideDirection[0] === 's' ? 'e' : 'w'];
      } else {
        // right turn
        return [insideDirection[1] === 'w' ? 'n' : 's', 'w'];
      }
    case '7':
      if (prevPosition.pos[0] < position.pos[0]) {
        // right turn
        return ['s', insideDirection[0] === 's' ? 'w' : 'e'];
      } else {
        // left turn
        return [insideDirection[1] === 'w' ? 's' : 'n', 'w'];
      }
    case 'F':
      if (prevPosition.pos[0] > position.pos[0]) {
        // left turn
        return ['s', insideDirection[0] === 's' ? 'e' : 'w'];
      } else {
        // right turn
        return [insideDirection[1] === 'w' ? 'n' : 's', 'e'];
      }
    default:
      return insideDirection;
  }
};

// depending on the char, decide which is the inside direction
const getInsideDirection = (
  position: MapPosition,
  insideDirection: ['n' | 's', 'w' | 'e']
): CardinalDirection[] | undefined => {
  switch (position.char) {
    case '|':
      return [insideDirection[1]];
    case '-':
      return [insideDirection[0]];
    case 'L':
      return insideDirection[0] === 'n' && insideDirection[1] === 'e'
        ? []
        : ['s', 'w'];
    case 'J':
      return insideDirection[0] === 'n' && insideDirection[1] === 'w'
        ? []
        : ['s', 'w'];
    case '7':
      return insideDirection[0] === 's' && insideDirection[1] === 'w'
        ? []
        : ['n', 'e'];
    case 'F':
      return insideDirection[0] === 's' && insideDirection[1] === 'e'
        ? []
        : ['n', 'w'];
  }
  return undefined;
};
const getSurroundedTiles = (map: Map, tile: MapPosition) =>
  [
    getPositionFromDirection(map, tile.pos, [-1, -1]),
    getPositionFromDirection(map, tile.pos, [-1, 0]),
    getPositionFromDirection(map, tile.pos, [-1, 1]),
    getPositionFromDirection(map, tile.pos, [0, -1]),
    getPositionFromDirection(map, tile.pos, [0, 1]),
    getPositionFromDirection(map, tile.pos, [1, -1]),
    getPositionFromDirection(map, tile.pos, [1, 0]),
    getPositionFromDirection(map, tile.pos, [1, 1]),
  ].filter((t) => t != null);
export const solveSecond = (input: string): string => {
  const map = importMap(input);
  const flatMap = map.flatMap((t) => t);
  const startPosition = flatMap.find((t) => t.isStart);
  const connectedStartPositions = getConnectedStartPositions(
    map,
    startPosition.pos
  );
  startPosition.char = connectedStartPositions.char;
  let position = {
    prevPosition: startPosition,
    currPosition: connectedStartPositions.connectedPositions[0],
  };
  position.currPosition.isPartOfLoop = true;
  // fill in the isPartOfLoop prop for the loop tiles
  while (position.currPosition.id != startPosition.id) {
    position = getNextPosition(
      map,
      position.currPosition,
      position.prevPosition
    )[0];
    position.currPosition.isPartOfLoop = true;
  }

  // navigate the pipes and set the isInsidePipes property on spaces next to it, starting from top left
  const topLeft = flatMap.find((t) => t.isPartOfLoop);
  position = {
    prevPosition: topLeft,
    currPosition: getPositionFromDirection(map, topLeft.pos, east.coord),
  };

  let insideDirection = getNextInsideDirection(
    position.currPosition,
    position.prevPosition,
    ['s', 'e'] as ['n' | 's', 'w' | 'e']
  );

  while (position.currPosition.id !== topLeft.id) {
    // Update inside dir tiles if any
    const insideDirections = getInsideDirection(
      position.currPosition,
      insideDirection
    );
    if (insideDirections.length > 0) {
      const insideTiles = insideDirections
        .map((inside) =>
          getPositionFromDirection(
            map,
            position.currPosition.pos,
            directions[inside].coord
          )
        )
        .filter((t) => t != null);
      insideTiles.forEach((insideTile) => {
        if (!insideTile.isPartOfLoop) {
          insideTile.isInsidePipes = true;
          // console.log('insideTile', insideTile);
        }
      });
    }
    // Update pos and inside direction
    position = getNextPosition(
      map,
      position.currPosition,
      position.prevPosition
    )[0];
    insideDirection = getNextInsideDirection(
      position.currPosition,
      position.prevPosition,
      insideDirection
    );
    // console.log('here', position.currPosition, insideDirection);
  }

  // We now have all the tiles that are inside and that touch the line,
  // all that is left is to check their neighbors and set them as inside as well
  let insidePipes = flatMap.filter((t) => t.isInsidePipes);
  console.log('init', insidePipes.length);
  while (insidePipes.length > 0) {
    const nextTiles = insidePipes
      .flatMap((tile) => getSurroundedTiles(map, tile))
      .filter((t) => t != null && !t.isPartOfLoop && !t.isInsidePipes);
    // console.log('nextTiles', nextTiles);
    nextTiles.forEach((t) => {
      t.isInsidePipes = true;
    });
    insidePipes = nextTiles;
  }

  const result = flatMap.filter((t) => t.isInsidePipes).length;
  return `solution 2 for input :\n${result}`;
};
