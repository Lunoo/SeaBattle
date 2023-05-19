<script lang="ts" setup>
import { Board, ConfigurationPanel, TheHeader } from './components'
import type { Configuration, Coords, Player } from '@/types'
import { GAME, PLAYERS } from '@/contants'
import {
  changeTurn,
  clearBoard,
  findStepEasy,
  getCellData,
  getPlayerShipsLeftNumber,
  initBoard,
  shootCell
} from '@/helpers'
import { ref, watch } from 'vue'

const config = ref<Configuration>({
  boardSize: { x: 10, y: 10 },
  shipSizes: [4, 3, 3, 2, 2, 2, 1, 1, 1, 1],
  status: GAME.initialization
})
const playerOne = ref<Player>({
  name: PLAYERS.playerOne,
  active: false,
  ships: []
})
const playerTwo = ref<Player>({
  name: PLAYERS.playerTwo,
  active: false,
  ships: []
})

const createNewGame = () => {
  config.value.status = GAME.configuring
  // Clear everything for both players.
  clearBoard(config, playerOne)
  clearBoard(config, playerTwo)
  // Generate initial ships placement for the Player 1. It can be changed.
  initBoard(config, playerOne)
  playerOne.value.board!.disabled = false
}

const startGame = () => {
  config.value.status = GAME.start
  // Update the board for Player 1 (in case if player changed ships placement) and initialize the board for Player 2.
  initBoard(config, playerOne)
  initBoard(config, playerTwo)
  playerOne.value.active = true
}

const handlePlayerOneShoot = (cell: Coords) => {
  if (config.value.status !== GAME.start || playerTwo.value.board?.disabled) {
    return
  }

  const cellData = getCellData(playerTwo.value.board, cell)
  if (!cellData || cellData.notAvailable) {
    return
  }

  const { isTargetHit } = shootCell(config.value.boardSize, playerTwo, cell)
  changeTurn(config, playerOne, playerTwo, isTargetHit)
}

const handlePlayerTwoShoot = (cell: Coords) => {
  if (config.value.status !== GAME.start || playerOne.value.board?.disabled) {
    return
  }

  const cellData = getCellData(playerOne.value.board, cell)
  if (!cellData || cellData.notAvailable) {
    return
  }

  const { isTargetHit } = shootCell(config.value.boardSize, playerOne, cell)
  changeTurn(config, playerOne, playerTwo, isTargetHit)
}

const handleEnemyTurn = () => {
  const cell = findStepEasy(config, playerOne)
  const { isTargetHit } = shootCell(config.value.boardSize, playerOne, cell)
  changeTurn(config, playerOne, playerTwo, isTargetHit)
}

watch(
  () => [playerTwo.value.active, playerOne.value.board],
  ([isPlayerTwoActive]) => {
    if (config.value.status === GAME.start) {
      const playerOneShipsLeft = getPlayerShipsLeftNumber(playerOne)
      const playerTwoShipsLeft = getPlayerShipsLeftNumber(playerTwo)

      if (playerOneShipsLeft === 0 || playerTwoShipsLeft === 0) {
        config.value.status = GAME.finish
      } else if (isPlayerTwoActive) {
        setTimeout(handleEnemyTurn, 500)
      }
    }
  }
)
</script>

<template>
  <the-header />
  <main>
    <board
      :active="playerTwo.active"
      :board-size="config.boardSize"
      :board-state="playerOne.board"
      :ships="playerOne.ships"
      @shoot-cell="handlePlayerTwoShoot"
    />
    <board
      :active="playerOne.active"
      :board-size="config.boardSize"
      :board-state="playerTwo.board"
      :ships="playerTwo.ships"
      @shoot-cell="handlePlayerOneShoot"
    />
  </main>
  <configuration-panel
    :game-status="config.status"
    @new-game="createNewGame"
    @start-game="startGame"
    @enemy-turn="handleEnemyTurn"
  />
</template>
<style src="./App.less" />
