<script lang="ts" setup>
import { Board, ConfigurationPanel, TheHeader } from './components'
import { ref } from 'vue'
import { generateShipsPlacement, initBoard } from '@/helpers/helpers'
import type { BoardState, Coords, ShipPlacement } from '@/types'

const boardSize: Coords = { x: 10, y: 10 }
const playerOneBoard = ref<BoardState>()
const playerTwoBoard = ref<BoardState>()
const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
const playerOneShips = ref<ShipPlacement[]>([])

const createNewGame = () => {
  // Generate initial ships placement for the Player 1. He can change it, if he want.
  playerOneShips.value = generateShipsPlacement(boardSize, shipSizes)
}

const startGame = () => {
  // Generate initial ships placement for the Player 2.
  const playerTwoShipsPlacement = generateShipsPlacement(boardSize, shipSizes)
  // Initialize the board for both players.
  playerOneBoard.value = initBoard(boardSize, playerOneShips.value, 'Player 1')
  playerTwoBoard.value = initBoard(boardSize, playerTwoShipsPlacement, 'Player 2')
}
</script>

<template>
  <the-header />
  <main>
    <board :board-size="boardSize" :ships="playerOneShips" />
    <board :board-size="boardSize" :ships="[]" />
  </main>
  <configuration-panel @new-game="createNewGame" @start-game="startGame" />
</template>
<style src="./App.less" />
