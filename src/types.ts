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
  hidden?: boolean
}

export type Direction = 'vertical' | 'horizontal'

export interface ShipPlacement {
  direction: Direction
  position: Coords
  size: number
}
