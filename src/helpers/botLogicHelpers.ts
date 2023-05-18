import type { BoardState, Cell, Coords, ShipPlacement } from '@/types'
import { DIRECTION, SHIP } from '@/contants'
import {
  coordsToString,
  getAnotherDirection,
  getRandomCell,
  getRandomDirection,
  getShipNearbyCells
} from '@/helpers/helpers'

const findBurningCells = (boardSize: Coords, board: BoardState, ship: ShipPlacement) => {
  const nearByCells = getShipNearbyCells(boardSize, ship)

  return nearByCells.filter((cell) => {
    const cellData = board.cells.get(coordsToString(cell))!

    return cellData.hit
  })
}

const findNextPossibleCellUnderShip = (
  board: BoardState,
  startCell: Coords,
  shipDirection: DIRECTION
) => {
  let searchDirection = Math.random() > 0.5 ? 1 : -1
  let searchDirectionChanged = false
  let searchPossible = true
  let searchStartCell = startCell

  while (searchPossible) {
    const nextCell: Coords = {
      x: searchStartCell.x + (shipDirection === DIRECTION.horizontal ? searchDirection : 0),
      y: searchStartCell.y + (shipDirection === DIRECTION.vertical ? searchDirection : 0)
    }
    const nextCellData = board.cells.get(coordsToString(nextCell))

    if (!nextCellData || nextCellData.missed || (nextCellData.notAvailable && !nextCellData.hit)) {
      if (!searchDirectionChanged) {
        searchDirection = -searchDirection
        searchDirectionChanged = true
      } else {
        searchPossible = false
      }
    } else if (nextCellData.hit) {
      searchStartCell = nextCell
    } else {
      searchPossible = false

      return nextCell
    }
  }
}

export const attemptToKillShip = (boardSize: Coords, board: BoardState, ship: ShipPlacement) => {
  const burningCells = findBurningCells(boardSize, board, ship)

  if (burningCells.length > 1) {
    const shipDirection =
      burningCells[0].x === burningCells[1].x ? DIRECTION.vertical : DIRECTION.horizontal

    return findNextPossibleCellUnderShip(board, burningCells[0], shipDirection)
  } else {
    const shipDirection = getRandomDirection()

    const nextCell = findNextPossibleCellUnderShip(board, burningCells[0], shipDirection)

    if (nextCell) {
      return nextCell
    } else {
      return findNextPossibleCellUnderShip(
        board,
        burningCells[0],
        getAnotherDirection(shipDirection)
      )
    }
  }
}

export const findStepEasy = (boardSize: Coords, board: BoardState, ships: ShipPlacement[]) => {
  // check if there are wounded but not destroyed ships
  const woundedShip = ships.find((ship) => ship.status === SHIP.wounded)

  if (woundedShip) {
    const step = attemptToKillShip(boardSize, board, woundedShip)

    if (!step) {
      console.error('Wounded ship should has at least 1 untouched nearby cell.')
    }

    return step
  } else {
    const untouchedCells: Cell[] = []
    board.cells.forEach((cell) => {
      if (!cell.hit && !cell.notAvailable && !cell.missed) {
        untouchedCells.push(cell)
      }
    })

    return getRandomCell(untouchedCells)
  }
}
