<template>
  <main>
    <Board :ships="myShips" />
    <Board :ships="[]" />
  </main>
</template>

<script lang="ts">
import { Board } from './components'
import { defineComponent, ref } from 'vue'
import type { ShipParams } from '@/types'

export default defineComponent({
  name: 'App',
  components: {
    Board
  },
  setup() {
    const myShips = ref<ShipParams[]>([
      {
        position: { x: 1, y: 0 },
        size: 3,
        direction: 'vertical'
      },
      {
        position: { x: 5, y: 5 },
        size: 2,
        direction: 'horizontal'
      }
    ])

    return {
      myShips
    }
  }
})
</script>

<style src="./App.less"></style>
