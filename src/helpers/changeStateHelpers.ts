import type { Cell, Coords, ShipPlacement, Turn } from '@/types'
import { PLAYERS, SHIP } from '@/contants'
import { coordsToString, getAnotherPlayer, getShipNearbyCells } from '@/helpers/helpers'

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

export const changeTurnState = (
  { player, iteration }: Turn,
  isTargetHit: boolean
): {
  disabled: boolean
  turn: Turn
} => {
  const newPlayer = isTargetHit ? player : getAnotherPlayer(player)

  return {
    disabled: newPlayer === PLAYERS.playerTwo,
    turn: {
      player: newPlayer,
      iteration: iteration++
    }
  }
}
