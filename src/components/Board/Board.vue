<script lang="ts" setup>
import type { BoardState as BoardStateType, Coords, ShipPlacement } from '@/types'
import BoardCell from '@/components/BoardCell/BoardCell.vue'
import type { PropType } from 'vue'
import Ship from '@/components/Ship/Ship.vue'
import { coordsToString } from '@/helpers/helpers'

const props = defineProps({
  boardSize: {
    type: Object as PropType<Coords>,
    required: true
  },
  boardState: {
    type: Object as PropType<BoardStateType>
  },
  ships: {
    type: Array as PropType<ShipPlacement[]>,
    required: true
  }
})

const getCellData = (cell: Coords) => props.boardState?.cells.get(coordsToString(cell))
</script>

<template>
  <div
    :class="{
      board: true,
      'board-disabled': !boardState || boardState.disabled
    }"
  >
    <div class="board--row" v-for="(_, y) in boardSize.y" :key="y">
      <label class="board--row-label">{{ String.fromCharCode(65 + y) }}</label>
      <board-cell
        v-for="(_, x) in boardSize.x"
        :key="x"
        :cellData="getCellData({ x, y })"
        @click="$emit('shoot-cell', { x, y })"
      >
        <label v-if="y === 0" class="board--cell-label">{{ x + 1 }}</label>
      </board-cell>
    </div>
    <ship
      v-for="(ship, i) in ships"
      :key="i"
      :board-hidden="boardState?.hidden"
      :ship-data="ship"
    />
  </div>
</template>
<style scoped src="./Board.less" />
