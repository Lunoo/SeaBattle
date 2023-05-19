<script lang="ts" setup>
import { Board, ConfigurationPanel, TheHeader } from './components'
import type { BoardState, Coords, ShipPlacement, Turn } from '@/types'
import { GAME, PLAYERS, SHIP } from '@/contants'
import {
  changeTurnState,
  coordsToString,
  findStepEasy,
  generateShipsPlacement,
  initBoard,
  shootCell
} from '@/helpers'
import { ref, watch } from 'vue'

const gameStatus = ref<GAME>(GAME.initialization)
const turnData = ref<Turn>({ player: PLAYERS.playerOne, iteration: 0 })
const boardSize: Coords = { x: 10, y: 10 }
const playerOneBoard = ref<BoardState | undefined>()
const playerTwoBoard = ref<BoardState | undefined>()
const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
const playerOneShips = ref<ShipPlacement[]>([])
const playerTwoShips = ref<ShipPlacement[]>([])

const createNewGame = () => {
  gameStatus.value = GAME.configuring
  playerOneBoard.value = {
    player: PLAYERS.playerOne,
    cells: new Map(),
    disabled: false
  }
  // Generate initial ships placement for the Player 1. It can be changed.
  playerOneShips.value = generateShipsPlacement(boardSize, shipSizes)
  // Set initial values for Player 2.
  playerTwoBoard.value = undefined
  playerTwoShips.value = []
}

const startGame = () => {
  gameStatus.value = GAME.start
  // Generate initial ships placement for the Player 2.
  playerTwoShips.value = generateShipsPlacement(boardSize, shipSizes)
  // Initialize the board for both players.
  playerOneBoard.value = initBoard(boardSize, playerOneShips.value, PLAYERS.playerOne)
  playerTwoBoard.value = initBoard(boardSize, playerTwoShips.value, PLAYERS.playerTwo)
}

const handlePlayerOneShoot = (cell: Coords) => {
  if (gameStatus.value !== GAME.start || !playerTwoBoard.value || playerTwoBoard.value.disabled) {
    return
  }

  const cellData = playerTwoBoard.value.cells.get(coordsToString(cell))
  if (!cellData || cellData.notAvailable) {
    return
  }

  const { board, ships, isTargetHit } = shootCell(
    boardSize,
    playerTwoBoard.value,
    playerTwoShips.value,
    cell
  )
  playerTwoBoard.value = board
  playerTwoShips.value = ships

  const { disabled, turn } = changeTurnState(turnData.value, isTargetHit)
  playerTwoBoard.value.disabled = disabled
  turnData.value = turn
}

const handlePlayerTwoShoot = (cell: Coords) => {
  if (gameStatus.value !== GAME.start || !playerOneBoard.value || playerOneBoard.value.disabled) {
    return
  }

  const { board, ships, isTargetHit } = shootCell(
    boardSize,
    playerOneBoard.value,
    playerOneShips.value,
    cell
  )
  playerOneBoard.value = board
  playerOneShips.value = ships

  const { disabled, turn } = changeTurnState(turnData.value, isTargetHit)
  playerTwoBoard.value!.disabled = disabled
  turnData.value = turn
}

const handleEnemyTurn = () => {
  if (!playerOneBoard.value) {
    return
  }

  const cell = findStepEasy(boardSize, playerOneBoard.value, playerOneShips.value)
  if (!cell) {
    return
  }

  const { board, ships, isTargetHit } = shootCell(
    boardSize,
    playerOneBoard.value,
    playerOneShips.value,
    cell
  )
  playerOneBoard.value = board
  playerOneShips.value = ships

  const { disabled, turn } = changeTurnState(turnData.value, isTargetHit)
  playerTwoBoard.value!.disabled = disabled
  turnData.value = turn
}

watch(turnData, () => {
  if (gameStatus.value === GAME.start) {
    const playerOneShipsLeft = playerOneShips.value.filter((ship) => ship.status !== SHIP.destroyed)
    const playerTwoShipsLeft = playerTwoShips.value.filter((ship) => ship.status !== SHIP.destroyed)

    if (playerOneShipsLeft.length === 0 || playerTwoShipsLeft.length === 0) {
      gameStatus.value = GAME.finish
    } else if (turnData.value.player === PLAYERS.playerTwo) {
      setTimeout(handleEnemyTurn, 500)
    }
  }
})
</script>

<template>
  <the-header />
  <main>
    <board
      :board-size="boardSize"
      :board-state="playerOneBoard"
      :ships="playerOneShips"
      @shoot-cell="handlePlayerTwoShoot"
    />
    <board
      :board-size="boardSize"
      :board-state="playerTwoBoard"
      :ships="playerTwoShips"
      @shoot-cell="handlePlayerOneShoot"
    />
  </main>
  <configuration-panel
    :game-status="gameStatus"
    @new-game="createNewGame"
    @start-game="startGame"
    @enemy-turn="handleEnemyTurn"
  />
</template>
<style src="./App.less" />
