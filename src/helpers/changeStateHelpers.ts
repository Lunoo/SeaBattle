import type { Cell, Configuration, Coords, Player, ShipPlacement } from '@/types'
import { PLAYERS, SHIP } from '@/contants'
import {
  checkIfPlayerHitTheShip,
  coordsMatches,
  coordsToString,
  getAnotherPlayer,
  getCellData,
  getShipCells,
  getShipNearbyCells
} from '@/helpers/helpers'
import type { Ref } from 'vue'

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

export const changeTurn = (
  config: Ref<Configuration>,
  playerOne: Ref<Player>,
  playerTwo: Ref<Player>,
  isTargetHit: boolean
) => {
  if (!playerOne.value.board || !playerTwo.value.board) {
    throw 'Board is not initialized'
  }

  const player = playerOne.value.active ? PLAYERS.playerOne : PLAYERS.playerTwo
  const newPlayer = isTargetHit ? player : getAnotherPlayer(player)

  playerTwo.value.board.disabled = newPlayer === PLAYERS.playerTwo
  playerOne.value.active = newPlayer === PLAYERS.playerOne
  playerTwo.value.active = newPlayer === PLAYERS.playerTwo
}

export const shootCell = (
  boardSize: Coords,
  player: Ref<Player>,
  coords: Coords
): {
  isTargetHit: boolean
} => {
  const {
    value: { board, ships }
  } = player
  const cellData = getCellData(board, coords)
  if (!cellData) {
    throw `Cell with coordinates {x: ${coords.x}, y: ${coords.y}} doesn't exist.`
  }

  const { hit, missed, notAvailable } = cellData

  if (hit || missed || notAvailable) {
    // if the status of the target cell differs from the default,
    // then it has already been shot at and nothing needs to be done
    return {
      isTargetHit: false
    }
  }

  const targetShip = checkIfPlayerHitTheShip(ships, coords)
  let newShips: ShipPlacement[] = ships
  // change the status of the target cell
  let newCells: Map<string, Cell> = changeCellState(board!.cells, cellData)

  if (targetShip) {
    const shipCells = getShipCells(targetShip)
    const isShipDestroyed =
      // If the ship has not yet been destroyed, we need to check all its cells:
      shipCells.every(
        // their coordinates either match the cell they are shooting at
        (cell) =>
          coordsMatches(cell, coords) ||
          // or the cell has already been shot before
          newCells.get(coordsToString(cell))?.hit
      )

    if (isShipDestroyed) {
      newShips = markShipAsDestroyed(ships, targetShip)
      newCells = markUnavailableCellsAfterDestructionOfShip(boardSize, newCells, targetShip)
    } else {
      newShips = markShipAsWounded(ships, targetShip)
    }
  }

  player.value = {
    ...player.value,
    board: {
      ...board,
      cells: newCells
    },
    ships: newShips
  }

  return {
    isTargetHit: !!targetShip
  }
}
