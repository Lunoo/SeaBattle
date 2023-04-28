<template>
  <Board />
</template>

<script setup lang="ts">
import { Board } from './components'
import { defineComponent } from 'vue'

defineComponent({
  components: {
    Board
  }
})
</script>

<style scoped></style>
