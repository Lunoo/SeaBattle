<template>
  <TheHeader />
  <main>
    <Board :board-size="boardSize" :ships="ships" />
    <Board :board-size="boardSize" :ships="[]" />
  </main>
  <ConfigurationPanel @new-game="startNewGame" />
</template>

<script lang="ts" setup>
import { Board, ConfigurationPanel, TheHeader } from './components'
import { ref } from 'vue'
import { generateShipsPlacement } from '@/helpers/helpers'
import type { Coords, ShipPlacement } from '@/types'

const boardSize: Coords = { x: 10, y: 10 }
const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
const ships = ref<ShipPlacement[]>([])

const startNewGame = () => {
  ships.value = generateShipsPlacement(boardSize, shipSizes)
}
</script>

<style src="./App.less" />
