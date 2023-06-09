import type { BoardState, Configuration, Coords, Player, ShipPlacement } from '@/types'
import { DIRECTION, PLAYERS, SHIP } from '@/contants'
import type { Ref } from 'vue'

const generateEmptyBoard = (boardSize: Coords) => {
  const board: Coords[] = []

  for (let y = 0; y < boardSize.y; y++) {
    for (let x = 0; x < boardSize.x; x++) {
      board.push({ x, y })
    }
  }

  return board
}

export const coordsMatches = (cell: Coords, cell2: Coords) =>
  cell.x === cell2.x && cell.y === cell2.y

export const coordsToString = ({ x, y }: Coords) => `${x}:${y}`

export const getShipCells = (ship: ShipPlacement) => {
  const cells: Coords[] = []
  const xMax =
    ship.direction === DIRECTION.horizontal ? ship.position.x + ship.size - 1 : ship.position.x
  const yMax =
    ship.direction === DIRECTION.vertical ? ship.position.y + ship.size - 1 : ship.position.y

  for (let y = ship.position.y; y <= yMax; y++) {
    for (let x = ship.position.x; x <= xMax; x++) {
      cells.push({ x, y })
    }
  }

  return cells
}

export const getShipNearbyCells = (boardSize: Coords, ship: ShipPlacement) => {
  const cells: Coords[] = []
  const xMin = Math.max(0, ship.position.x - 1)
  const xMax = Math.min(
    boardSize.x - 1,
    ship.direction === DIRECTION.horizontal ? ship.position.x + ship.size : ship.position.x + 1
  )
  const yMin = Math.max(0, ship.position.y - 1)
  const yMax = Math.min(
    boardSize.y - 1,
    ship.direction === DIRECTION.vertical ? ship.position.y + ship.size : ship.position.y + 1
  )

  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      cells.push({ x, y })
    }
  }

  return cells
}

const checkIfShipCanBePlaced = (
  { direction, position, size }: ShipPlacement,
  freeCells: Coords[]
) =>
  Array.from(Array(size).keys()).every((i) => {
    const coordsToCheck = {
      x: direction === DIRECTION.horizontal ? position.x + i : position.x,
      y: direction === DIRECTION.vertical ? position.y + i : position.y
    }

    return freeCells.find((cell) => coordsMatches(cell, coordsToCheck))
  })

export const checkIfPlayerHitTheShip = (shipPlacement: ShipPlacement[], coords: Coords) =>
  shipPlacement.find((ship) => {
    const shipCells = getShipCells(ship)

    return shipCells.find((cell) => coordsMatches(cell, coords))
  })

export const getRandomCell = (cells: Coords[]) => {
  const index = Math.floor(Math.random() * cells.length)

  return cells[index]
}

export const getRandomDirection = (): DIRECTION =>
  Math.random() > 0.5 ? DIRECTION.horizontal : DIRECTION.vertical
export const getAnotherDirection = (direction: DIRECTION): DIRECTION =>
  direction === DIRECTION.horizontal ? DIRECTION.vertical : DIRECTION.horizontal

export const getAnotherPlayer = (player: PLAYERS): PLAYERS =>
  player === PLAYERS.playerOne ? PLAYERS.playerTwo : PLAYERS.playerOne

/** Method to filter all cells under the ship including nearby cells. */
const getFreeCellsAfterKilling = (
  boardSize: Coords,
  freeCells: Coords[],
  ship: ShipPlacement
): Coords[] => {
  const nearbyCells = getShipNearbyCells(boardSize, ship)
  // Set with unique coordinates. Created to optimize filtering.
  const cellsToRemove = new Set(nearbyCells.map((cell) => coordsToString(cell)))

  return freeCells.filter((cell) => !cellsToRemove.has(coordsToString(cell)))
}

const generateShipsPlacement = ({
  value: { boardSize, shipSizes }
}: Ref<Configuration>): ShipPlacement[] => {
  const shipsPlacement: ShipPlacement[] = []
  // cells available for placing ship
  let freeCells = generateEmptyBoard(boardSize)

  shipSizes.forEach((shipSize) => {
    let possibleStartPositionForCurrentShip = [...freeCells]

    // If there are no more free cells, a board with such a configuration cannot be created.
    if (freeCells.length === 0) {
      throw "Can't generate board!"
    }

    while (possibleStartPositionForCurrentShip.length !== 0) {
      // Looking for a potential place for the ship
      const cell = getRandomCell(possibleStartPositionForCurrentShip)
      const direction = getRandomDirection()

      const ship = {
        index: shipsPlacement.length,
        direction,
        position: cell,
        size: shipSize,
        status: SHIP.alive
      }
      const isShipCanBePlaced = checkIfShipCanBePlaced(ship, freeCells)
      if (isShipCanBePlaced) {
        // If the found cell and the direction are suitable, add it to the final array
        // and remove the occupied cells from "freeCells" and "possibleStartPositions"
        shipsPlacement.push(ship)
        freeCells = getFreeCellsAfterKilling(boardSize, freeCells, ship)
        break
      } else {
        // Also need to check another direction for the ship
        const ship2 = {
          index: shipsPlacement.length,
          direction: getAnotherDirection(direction),
          position: cell,
          size: shipSize,
          status: SHIP.alive
        }
        const isShip2CanBePlaced = checkIfShipCanBePlaced(
          ship2,
          possibleStartPositionForCurrentShip
        )
        if (isShip2CanBePlaced) {
          shipsPlacement.push(ship2)
          freeCells = getFreeCellsAfterKilling(boardSize, freeCells, ship2)
          break
        }
      }

      // If the cell does not fit, remove it and go to the next iteration
      possibleStartPositionForCurrentShip = possibleStartPositionForCurrentShip.filter(
        (possibleCell) => !coordsMatches(possibleCell, cell)
      )

      // If there are no more free cells, a board with such a configuration cannot be created.
      if (possibleStartPositionForCurrentShip.length === 0) {
        throw "Can't generate board!"
      }
    }
  })

  return shipsPlacement
}

export const clearBoard = (player: Ref<Player>) => {
  player.value = {
    ...player.value,
    active: false,
    board: undefined,
    ships: []
  }
}

export const initBoard = (
  config: Ref<Configuration>,
  player: Ref<Player>,
  ships?: ShipPlacement[]
) => {
  const board: BoardState = {
    cells: new Map(),
    hidden: player.value.name === PLAYERS.playerTwo,
    disabled: player.value.name === PLAYERS.playerOne
  }
  const playerShips =
    ships ?? player.value.ships.length ? player.value.ships : generateShipsPlacement(config)

  for (let y = 0; y < config.value.boardSize.y; y++) {
    for (let x = 0; x < config.value.boardSize.x; x++) {
      const occupied = !!checkIfPlayerHitTheShip(playerShips, { x, y })
      board.cells.set(`${x}:${y}`, {
        x,
        y,
        occupied,
        hit: false,
        missed: false,
        notAvailable: false
      })
    }
  }

  player.value = {
    ...player.value,
    board: board,
    ships: playerShips
  }
}

export const getCellData = (board: BoardState | undefined, coords: Coords) =>
  board?.cells.get(coordsToString(coords))

export const getPlayerShipsLeftNumber = (player: Ref<Player>) =>
  player.value.ships.filter((ship) => ship.status !== SHIP.destroyed).length
