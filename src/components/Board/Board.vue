<script lang="ts" setup>
import type { Configuration, Player as PlayerType } from '@/types'
import BoardCell from '@/components/BoardCell/BoardCell.vue'
import BoardSummary from '@/components/BoardSummary/BoardSummary.vue'
import { GAME } from '@/contants'
import type { PropType } from 'vue'
import Ship from '@/components/Ship/Ship.vue'
import { getCellData } from '@/helpers'

defineProps({
  config: {
    type: Object as PropType<Configuration>,
    required: true
  },
  player: {
    type: Object as PropType<PlayerType>,
    required: true
  }
})
defineEmits(['shoot-cell'])
</script>

<template>
  <div class="board--player">
    <h3 class="board--header">{{ player.name }}</h3>
    <div class="board--container">
      <div
        :class="{
          board: true,
          'board-disabled': !player.board || player.board.disabled,
          'board-active': config.status === GAME.start && !player.active
        }"
      >
        <div class="board--row" v-for="(_, y) in config.boardSize.y" :key="y">
          <label class="board--row-label">{{ String.fromCharCode(65 + y) }}</label>
          <board-cell
            v-for="(_, x) in config.boardSize.x"
            :key="x"
            :cellData="getCellData(player.board, { x, y })"
            @click="$emit('shoot-cell', { x, y })"
          >
            <label v-if="y === 0" class="board--cell-label">{{ x + 1 }}</label>
          </board-cell>
        </div>
        <ship
          v-for="(ship, i) in player.ships"
          :key="i"
          :board-hidden="player.board?.hidden"
          :ship-data="ship"
        />
      </div>
      <board-summary :ship-sizes="config.shipSizes" :ships="player.ships" />
    </div>
  </div>
</template>
<style scoped src="./Board.less" />
