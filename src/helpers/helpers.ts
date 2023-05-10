import type { BoardState, Coords, Direction, ShipPlacement } from '@/types'

const generateEmptyBoard = (boardSize: Coords) => {
  const board: Coords[] = []

  for (let y = 0; y < boardSize.y; y++) {
    for (let x = 0; x < boardSize.x; x++) {
      board.push({ x, y })
    }
  }

  return board
}

const coordsMatches = (cell: Coords, cell2: Coords) => cell.x === cell2.x && cell.y === cell2.y

const getShipCells = (ship: ShipPlacement) => {
  const cells: Coords[] = []
  const xMax = ship.direction === 'horizontal' ? ship.position.x + ship.size - 1 : ship.position.x
  const yMax = ship.direction === 'vertical' ? ship.position.y + ship.size - 1 : ship.position.y

  for (let y = ship.position.y; y <= yMax; y++) {
    for (let x = ship.position.x; x <= xMax; x++) {
      cells.push({ x, y })
    }
  }

  return cells
}

const getShipNearbyCells = (ship: ShipPlacement) => {
  const cells: Coords[] = []
  const xMax = ship.direction === 'horizontal' ? ship.position.x + ship.size - 1 : ship.position.x
  const yMax = ship.direction === 'vertical' ? ship.position.y + ship.size - 1 : ship.position.y

  for (let y = ship.position.y - 1; y <= yMax + 1; y++) {
    for (let x = ship.position.x - 1; x <= xMax + 1; x++) {
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
      x: direction === 'horizontal' ? position.x + i : position.x,
      y: direction === 'vertical' ? position.y + i : position.y
    }

    return freeCells.find((cell) => coordsMatches(cell, coordsToCheck))
  })

const checkIfPlayerHitTheShip = (shipPlacement: ShipPlacement[], coords: Coords) =>
  !!shipPlacement.find((ship) => {
    const shipCells = getShipCells(ship)

    return shipCells.find((cell) => coordsMatches(cell, coords))
  })

export const getRandomCell = (cells: Coords[]) => {
  const index = Math.floor(Math.random() * cells.length)

  return cells[index]
}

const getRandomDirection = (): Direction => (Math.random() > 0.5 ? 'horizontal' : 'vertical')
const getAnotherDirection = (direction: Direction): Direction =>
  direction === 'horizontal' ? 'vertical' : 'horizontal'

/** Method to filter all cells under the ship including nearby cells. */
const getFreeCellsAfterKilling = (freeCells: Coords[], ship: ShipPlacement): Coords[] => {
  const nearbyCells = getShipNearbyCells(ship)
  // Set with unique coordinates. Created to optimize filtering.
  const cellsToRemove = new Set(nearbyCells.map((cell) => `${cell.x}:${cell.y}`))

  return freeCells.filter((cell) => !cellsToRemove.has(`${cell.x}:${cell.y}`))
}

export const generateShipsPlacement = (
  boardSize: Coords,
  shipsSizes: number[]
): ShipPlacement[] => {
  const shipsPlacement: ShipPlacement[] = []
  let freeCells = generateEmptyBoard(boardSize)
  let error: string | undefined

  shipsSizes.forEach((shipSize) => {
    let freeCellsForCurrentShip = [...freeCells]

    while (!error) {
      // Looking for a potential place for the ship
      const cell = getRandomCell(freeCellsForCurrentShip)
      const direction = getRandomDirection()

      const ship = { direction, position: cell, size: shipSize }
      const isShipCanBePlaced = checkIfShipCanBePlaced(ship, freeCellsForCurrentShip)
      if (isShipCanBePlaced) {
        // If the found cell and the direction are suitable, add it to the final array
        // and remove the occupied cells from "freeCells"
        shipsPlacement.push(ship)
        freeCells = getFreeCellsAfterKilling(freeCells, ship)
        break
      } else {
        // Also need to check another direction for the ship
        const ship2 = { direction: getAnotherDirection(direction), position: cell, size: shipSize }
        const isShip2CanBePlaced = checkIfShipCanBePlaced(ship2, freeCellsForCurrentShip)
        if (isShip2CanBePlaced) {
          shipsPlacement.push(ship2)
          freeCells = getFreeCellsAfterKilling(freeCells, ship2)
          break
        }
      }

      // If the cell does not fit, remove it and go to the next iteration
      freeCellsForCurrentShip = freeCellsForCurrentShip.filter(
        (freeCell) => !coordsMatches(freeCell, cell)
      )

      // If there are no more free cells, a board with such a configuration cannot be created.
      if (freeCellsForCurrentShip.length === 0) {
        error = "Can't generate board!"

        break
      }
    }
  })

  if (error) {
    console.error(error)
    return []
  } else {
    return shipsPlacement
  }
}

export const initBoard = (
  boardSize: Coords,
  shipsPlacement: ShipPlacement[],
  player: string
): BoardState => {
  const board: BoardState = {
    cells: [],
    player,
    hidden: player === 'Player 2'
  }
  for (let y = 0; y < boardSize.y; y++) {
    for (let x = 0; x < boardSize.x; x++) {
      const occupied = checkIfPlayerHitTheShip(shipsPlacement, { x, y })
      board.cells.push({ x, y, occupied, hit: false, missed: false, notAvailable: false })
    }
  }

  return board
}
