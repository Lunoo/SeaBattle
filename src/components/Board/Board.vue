<template>
  <div class="board">
    <div class="board--row" v-for="(_, y) in boardSize.y" :key="y">
      <label class="board--row-label">{{ String.fromCharCode(65 + y) }}</label>
      <div class="board--field" v-for="(_, x) in boardSize.x" :key="x">
        <label v-if="y === 0" class="board--field-label">{{ x + 1 }}</label>
      </div>
    </div>
    <Ship
      v-for="(ship, i) in ships"
      :key="i"
      :direction="ship.direction"
      :position="ship.position"
      :size="ship.size"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { Coords, ShipPlacement } from '@/types'
import Ship from '@/components/Ship/Ship.vue'

export default defineComponent({
  props: {
    ships: {
      type: Array as PropType<ShipPlacement[]>,
      required: true
    }
  },
  name: 'Board',
  components: { Ship },
  setup() {
    const boardSize: Coords = { x: 10, y: 10 }

    return {
      boardSize
    }
  }
})
</script>

<style scoped src="./Board.less" />
