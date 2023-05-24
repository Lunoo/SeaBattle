export const cellSize = 25
export enum PLAYERS {
  playerOne = 'Player',
  playerTwo = 'CPU'
}

export enum GAME {
  initialization = 'initialization',
  configuring = 'configuring',
  start = 'start',
  finish = 'finish'
}

export enum SHIP {
  alive = 'alive',
  wounded = 'wounded',
  destroyed = 'destroyed'
}

export enum DIRECTION {
  vertical = 'vertical',
  horizontal = 'horizontal'
}

export enum BOARD_TYPES {
  default = 'default',
  large = 'large',
  middle = 'middle',
  small = 'small'
}

export const BOARD_CONFIGURATION = {
  [BOARD_TYPES.default]: {
    name: 'Default: 10x10',
    shipSizes: [4, 3, 3, 2, 2, 2, 1, 1, 1, 1],
    boardSize: { x: 10, y: 10 }
  },
  [BOARD_TYPES.large]: {
    name: 'Large: 13x13',
    shipSizes: [5, 4, 4, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1],
    boardSize: { x: 13, y: 13 }
  },
  [BOARD_TYPES.middle]: {
    name: 'Middle: 7x7',
    shipSizes: [3, 2, 2, 1, 1, 1],
    boardSize: { x: 7, y: 7 }
  },
  [BOARD_TYPES.small]: {
    name: 'Small: 4x4',
    shipSizes: [2, 1, 1],
    boardSize: { x: 4, y: 4 }
  }
}
