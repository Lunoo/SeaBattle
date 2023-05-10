export interface Coords {
  x: number
  y: number
}

export interface Cell extends Coords {
  hit: boolean
  missed: boolean
  notAvailable: boolean
  occupied: boolean
}

export interface BoardState {
  cells: Cell[]
  player: string
  hidden?: boolean
}

export type Direction = 'vertical' | 'horizontal'

export interface ShipPlacement {
  direction: Direction
  position: Coords
  size: number
}
