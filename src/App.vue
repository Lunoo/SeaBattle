<script lang="ts" setup>
import { Board, ConfigurationPanel, TheHeader } from './components'
import type { BoardState, Coords, ShipPlacement } from '@/types'
import { GAME, PLAYERS, SHIP } from '@/contants'
import { findStepEasy, generateShipsPlacement, initBoard, shootCell } from '@/helpers'
import { ref } from 'vue'

const gameStatus = ref<GAME>(GAME.initialization)
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
  // Generate initial ships placement for the Player 1. He can change it, if he want.
  playerOneShips.value = generateShipsPlacement(boardSize, shipSizes)
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
  if (gameStatus.value !== GAME.start || !playerOneBoard.value || playerOneBoard.value.disabled) {
    return
  }

  const { board, ships } = shootCell(boardSize, playerOneBoard.value, playerOneShips.value, cell)
  playerOneBoard.value = board
  playerOneShips.value = ships
}

const handlePlayerTwoShoot = (cell: Coords) => {
  if (gameStatus.value !== GAME.start || !playerTwoBoard.value || playerTwoBoard.value.disabled) {
    return
  }

  const { board, ships } = shootCell(boardSize, playerTwoBoard.value, playerTwoShips.value, cell)
  playerTwoBoard.value = board
  playerTwoShips.value = ships
}

const handleEnemyTurn = () => {
  if (!playerTwoBoard.value) {
    return
  }

  const cell = findStepEasy(boardSize, playerTwoBoard.value, playerTwoShips.value)
  if (!cell) {
    return
  }

  const { board, ships } = shootCell(boardSize, playerTwoBoard.value, playerTwoShips.value, cell)
  playerTwoBoard.value = board
  playerTwoShips.value = ships

  const shipsLeft = ships.filter((ship) => ship.status !== SHIP.destroyed)
  if (shipsLeft.length === 0) {
    gameStatus.value = GAME.finish
  }
}
</script>

<template>
  <the-header />
  <main>
    <board
      :board-size="boardSize"
      :board-state="playerOneBoard"
      :ships="playerOneShips"
      @shoot-cell="handlePlayerOneShoot"
    />
    <board
      :board-size="boardSize"
      :board-state="playerTwoBoard"
      :ships="playerTwoShips"
      @shoot-cell="handlePlayerTwoShoot"
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
