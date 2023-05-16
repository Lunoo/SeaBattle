<script lang="ts" setup>
import { Board, ConfigurationPanel, TheHeader } from './components'
import { ref } from 'vue'
import { coordsToString, generateShipsPlacement, initBoard } from '@/helpers/helpers'
import type { BoardState, Coords, ShipPlacement } from '@/types'

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

const shootCell = (coords: Coords) => {
  const value = playerOneBoard.value.cells.get(coordsToString(coords))!
  playerOneBoard.value.cells.set(coordsToString(coords), {
    ...value,
    hit: value.occupied,
    missed: !value.occupied
  })
}
</script>

<template>
  <the-header />
  <main>
    <board
      :board-size="boardSize"
      :board-state="playerOneBoard"
      :ships="playerOneShips"
      @shoot-cell="shootCell"
    />
    <board :board-size="boardSize" :board-state="playerTwoBoard" :ships="[]" />
  </main>
  <configuration-panel @new-game="createNewGame" @start-game="startGame" />
</template>
<style src="./App.less" />
