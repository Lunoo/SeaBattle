<script lang="ts" setup>
import type { Cell } from '@/types'
import type { PropType } from 'vue'

defineProps({
  cellData: {
    type: Object as PropType<Cell>,
    required: true,
    default: () => ({})
  }
})
defineEmits(['click'])
</script>

<template>
  <div
    :class="{
      'board--cell': true,
      'board--cell-hit': cellData.hit,
      'board--cell-missed': cellData.missed,
      'board--cell-notAvailable': cellData.notAvailable
    }"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>
<style scoped src="./BoardCell.less" />
