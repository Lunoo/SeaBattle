import type { BOARD_TYPES, DIRECTION, GAME, PLAYERS, SHIP } from '@/contants'

export interface Coords {
  x: number
  y: number
}

export interface Cell {
  x: number
  y: number
  hit: boolean
  missed: boolean
  notAvailable: boolean
  occupied: boolean
}

export interface BoardState {
  cells: Map<string, Cell>
  disabled?: boolean
  hidden?: boolean
}

export interface ShipPlacement {
  index: number
  direction: DIRECTION
  position: Coords
  size: number
  status: SHIP
}

export interface Turn {
  player: PLAYERS
  iteration: number
}

export interface Player {
  name: PLAYERS
  active: boolean
  board?: BoardState
  ships: ShipPlacement[]
}

export interface Configuration {
  boardSize: Coords
  boardType: BOARD_TYPES
  shipSizes: number[]
  status: GAME
}
