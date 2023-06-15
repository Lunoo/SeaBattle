<script lang="ts" setup>
import { GAME, PLAYERS } from '@/contants'
import type { GAME as GameType } from '@/contants'
import type { PropType } from 'vue'

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
defineEmits(['new-game', 'toggle-game'])
</script>

<template>
  <div class="configuration-panel">
    <div v-if="gameStatus === GAME.finish" class="configuration-panel__results">
      {{ player }} win the game!
    </div>
    <div class="configuration-panel__buttons-container">
      <button @click="$emit('new-game')">
        {{ gameStatus === GAME.configuring ? 'Generate' : 'New game' }}
      </button>
      <button
        :disabled="gameStatus !== GAME.configuring && gameStatus !== GAME.finish"
        @click="$emit('toggle-game')"
      >
        {{
          gameStatus === GAME.configuring || gameStatus === GAME.initialization ? 'Start' : 'Finish'
        }}
      </button>
    </div>
  </div>
</template>
<style scoped src="./ConfigurationPanel.less" />
