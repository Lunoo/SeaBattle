<template>
  <div :class="`ship ship--${direction}`" :style="styles"></div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import type { PropType } from 'vue'
import type { Coords, Direction } from '@/types'

const cellSize = 25
const props = defineProps({
  position: {
    type: Object as PropType<Coords>,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  direction: {
    type: String as PropType<Direction>
  }
})

const styles = computed(() => ({
  width: props.direction === 'horizontal' ? cellSize * props.size + 'px' : `${cellSize}px`,
  height: props.direction === 'vertical' ? cellSize * props.size + 'px' : `${cellSize}px`,
  left: cellSize * props.position.x + 'px',
  top: cellSize * props.position.y + 'px'
}))
</script>

<style scoped src="./Ship.less" />
