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
