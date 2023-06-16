<script lang="ts" setup>
import { GAME } from '@/contants'
import type { PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  gameStatus: {
    type: String as PropType<GAME>,
    required: true
  }
})
const canOpenSettings = computed(() => props.gameStatus === GAME.initialization)

defineEmits(['toggle-settings'])
</script>

<template>
  <header class="header">
    <h1>Sea Battle</h1>
    <button
      :disabled="!canOpenSettings"
      :title="!canOpenSettings ? `Can't change settings while playing.` : undefined"
      class="header__settings"
      @click="$emit('toggle-settings')"
    />
  </header>
</template>
<style src="./TheHeader.less" />
