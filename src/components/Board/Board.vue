<script lang="ts" setup>
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import type { Coords, ShipPlacement } from '@/types'
import Ship from '@/components/Ship/Ship.vue'

defineProps({
  boardSize: {
    type: Object as PropType<Coords>,
    required: true
  },
  ships: {
    type: Array as PropType<ShipPlacement[]>,
    required: true
  }
})
</script>

<template>
  <div class="board">
    <div class="board--row" v-for="(_, y) in boardSize.y" :key="y">
      <label class="board--row-label">{{ String.fromCharCode(65 + y) }}</label>
      <div class="board--cell" v-for="(_, x) in boardSize.x" :key="x">
        <label v-if="y === 0" class="board--cell-label">{{ x + 1 }}</label>
      </div>
    </div>
    <ship
      v-for="(ship, i) in ships"
      :key="i"
      :direction="ship.direction"
      :position="ship.position"
      :size="ship.size"
    />
  </div>
</template>
<style scoped src="./Board.less" />
