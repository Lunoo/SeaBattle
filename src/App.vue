<script lang="ts" setup>
import { BOARD_CONFIGURATION, BOARD_TYPES, GAME, GAME_MODE, PLAYERS } from '@/contants'
import { Board, ChipListBox, ChipOption, ConfigurationPanel, Modal, TheHeader } from './components'
import type { Configuration, Coords, Player } from '@/types'
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

const generateConfig = (type: BOARD_TYPES) => ({
  boardType: type,
  boardSize: BOARD_CONFIGURATION[type].boardSize,
  mode: GAME_MODE.easy,
  shipSizes: BOARD_CONFIGURATION[type].shipSizes,
  status: GAME.initialization
})
const config = ref<Configuration>(generateConfig(BOARD_TYPES.default))

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

const modalRef = ref<Modal>(null)

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
const handleOpenSettings = () => {
  modalRef.value?.openModal()
}

const handleChangeMode = (value: GAME_MODE) => {
  config.value.mode = value
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
  <the-header @toggle-settings="handleOpenSettings" />
  <main>
    <board :config="config" :player="playerOne" @shoot-cell="handlePlayerTwoShoot" />
    <board :config="config" :player="playerTwo" @shoot-cell="handlePlayerOneShoot" />
  </main>
  <configuration-panel
    :game-status="config.status"
    :player="playerOne.active ? PLAYERS.playerOne : PLAYERS.playerTwo"
    @new-game="createNewGame"
    @start-game="startGame"
  />
  <modal class-name="settings" ref="modalRef">
    <template #header><h3>Settings</h3></template>
    <template #body>
      <chip-list-box :selected="config.mode" :on-change="handleChangeMode" v-slot="chipProps">
        <chip-option class-name="easy" v-bind="chipProps" :value="GAME_MODE.easy" />
        <chip-option class-name="hard" v-bind="chipProps" :value="GAME_MODE.hard" />
      </chip-list-box>
    </template>
  </modal>
</template>
<style src="./App.less" />
