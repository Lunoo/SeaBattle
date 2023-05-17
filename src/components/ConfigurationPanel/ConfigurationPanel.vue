<script lang="ts" setup>
import { GAME } from '@/contants'
import type { GAME as GameType } from '@/contants'
import type { PropType } from 'vue'

defineEmits(['new-game', 'start-game'])
defineProps({
  gameStatus: {
    type: String as PropType<GameType>,
    required: true
  }
})
</script>

<template>
  <div class="ConfigurationPanel">
    <button @click="$emit('new-game')">New game</button>
    <button :disabled="gameStatus !== GAME.configuring" @click="$emit('start-game')">Start</button>
  </div>
</template>
<style scoped src="./ConfigurationPanel.less" />
