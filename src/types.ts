import type { PLAYERS, SHIP } from '@/contants'

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
  player: string
  disabled?: boolean
  hidden?: boolean
}

export type Direction = 'vertical' | 'horizontal'

export interface ShipPlacement {
  index: number
  direction: Direction
  position: Coords
  size: number
  status: SHIP
}

export interface Turn {
  player: PLAYERS
  iteration: number
}
