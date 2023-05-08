export interface Coords {
  x: number
  y: number
}

export type Direction = 'vertical' | 'horizontal'

export interface ShipPlacement {
  direction: Direction
  position: Coords
  size: number
}
