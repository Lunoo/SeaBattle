<script lang="ts" setup>
import { Board, ConfigurationPanel, TheHeader } from './components'
import type { BoardState, Coords, ShipPlacement } from '@/types'
import { generateShipsPlacement, initBoard, shootCell } from '@/helpers/helpers'
import { PLAYERS } from '@/contants'
import { ref } from 'vue'

const boardSize: Coords = { x: 10, y: 10 }
const playerOneBoard = ref<BoardState>({
  player: '',
  cells: new Map()
})
const playerTwoBoard = ref<BoardState>({
  player: '',
  cells: new Map()
})
const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
const playerOneShips = ref<ShipPlacement[]>([])
const playerTwoShips = ref<ShipPlacement[]>([])

const createNewGame = () => {
  // Generate initial ships placement for the Player 1. He can change it, if he want.
  playerOneShips.value = generateShipsPlacement(boardSize, shipSizes)
}

const startGame = () => {
  // Generate initial ships placement for the Player 2.
  playerTwoShips.value = generateShipsPlacement(boardSize, shipSizes)
  // Initialize the board for both players.
  playerOneBoard.value = initBoard(boardSize, playerOneShips.value, PLAYERS.playerOne)
  playerTwoBoard.value = initBoard(boardSize, playerTwoShips.value, PLAYERS.playerTwo)
}

const handlePlayerOneShoot = (cell: Coords) => {
  const { board, ships } = shootCell(boardSize, playerOneBoard.value, playerOneShips.value, cell)
  playerOneBoard.value = board
  playerOneShips.value = ships
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
    <board :board-size="boardSize" :board-state="playerTwoBoard" :ships="[]" />
  </main>
  <configuration-panel @new-game="createNewGame" @start-game="startGame" />
</template>
<style src="./App.less" />
