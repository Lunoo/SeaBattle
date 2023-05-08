<template>
  <main>
    <Board :ships="ships" />
    <Board :ships="[]" />
  </main>
</template>

<script lang="ts">
import { Board } from './components'
import { defineComponent, ref } from 'vue'
import { generateShipsPlacement } from '@/helpers/helpers'
import type { ShipPlacement } from '@/types'

export default defineComponent({
  name: 'App',
  components: {
    Board
  },
  setup() {
    const ships = ref<ShipPlacement[]>(
      generateShipsPlacement({ x: 10, y: 10 }, [4, 3, 3, 2, 2, 2, 1, 1, 1, 1])
    )

    return {
      ships
    }
  }
})
</script>

<style src="./App.less"></style>
