<script lang="ts" setup>
import { GAME, PLAYERS } from '@/contants'
import type { GAME as GameType } from '@/contants'
import type { PropType } from 'vue'

defineEmits(['new-game', 'start-game'])
defineProps({
  gameStatus: {
    type: String as PropType<GameType>,
    required: true
  },
  player: {
    type: String as PropType<PLAYERS>,
    required: true
  }
})
</script>

<template>
  <div class="configurationPanel">
    <div v-if="gameStatus === GAME.finish" class="configurationPanel--results">
      {{ player }} win the game!
    </div>
    <div class="configurationPanel--buttonsContainer">
      <button @click="$emit('new-game')">New game</button>
      <button :disabled="gameStatus !== GAME.configuring" @click="$emit('start-game')">
        Start
      </button>
    </div>
  </div>
</template>
<style scoped src="./ConfigurationPanel.less" />
