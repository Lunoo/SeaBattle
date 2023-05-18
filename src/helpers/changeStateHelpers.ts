import type { Cell, Coords, ShipPlacement } from '@/types'
import { coordsToString, getShipNearbyCells } from '@/helpers/helpers'
import { SHIP } from '@/contants'

export const markShipAsWounded = (ships: ShipPlacement[], ship: ShipPlacement) => {
  const newShips = [...ships]
  newShips[ship.index] = {
    ...newShips[ship.index],
    status: SHIP.wounded
  }

  return newShips
}

export const markShipAsDestroyed = (ships: ShipPlacement[], ship: ShipPlacement) => {
  const newShips = [...ships]
  newShips[ship.index] = {
    ...newShips[ship.index],
    status: SHIP.destroyed
  }

  return newShips
}

export const markUnavailableCellsAfterDestructionOfShip = (
  boardSize: Coords,
  cells: Map<string, Cell>,
  ship: ShipPlacement
): Map<string, Cell> => {
  const shipCells = getShipNearbyCells(boardSize, ship)
  const newCells = new Map(cells)

  shipCells.forEach((shipCell) => {
    const id = coordsToString(shipCell)
    const cellData = newCells.get(id)!
    newCells.set(id, {
      ...cellData,
      notAvailable: true
    })
  })

  return newCells
}

export const changeCellState = (cells: Map<string, Cell>, cellData: Cell): Map<string, Cell> => {
  const id = coordsToString({ x: cellData.x, y: cellData.y })
  const newCells = new Map(cells)
  newCells.set(id, {
    ...cellData,
    hit: cellData.occupied,
    missed: !cellData.occupied,
    notAvailable: true
  })

  return newCells
}
