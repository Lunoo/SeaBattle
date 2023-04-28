<template>
  <div class="board">
    <div class="board--row" v-for="(_, y) in boardSize.y" :key="y">
      <div class="board--field" v-for="(_, x) in boardSize.x" :key="x">({{ x }}, {{ y }})</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Coords {
  x: number
  y: number
}
export default defineComponent({
  name: 'Board',
  setup() {
    const boardSize: Coords = { x: 10, y: 10 }

    return {
      boardSize
    }
  }
})
</script>

<style scoped src="./Board.less" />
