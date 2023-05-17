<script lang="ts" setup>
import type { PropType } from 'vue'
import type { ShipPlacement } from '@/types'
import { cellSize } from '@/contants'
import { computed } from 'vue'

const props = defineProps({
  boardHidden: {
    type: Boolean
  },
  shipData: {
    type: Object as PropType<ShipPlacement>,
    required: true
  }
})

const styles = computed(() => ({
  width:
    props.shipData.direction === 'horizontal'
      ? cellSize * props.shipData.size + 'px'
      : `${cellSize}px`,
  height:
    props.shipData.direction === 'vertical'
      ? cellSize * props.shipData.size + 'px'
      : `${cellSize}px`,
  left: cellSize * props.shipData.position.x + 'px',
  top: cellSize * props.shipData.position.y + 'px'
}))
</script>

<template>
  <div
    v-if="shipData.destroyed || !boardHidden"
    :class="`ship ship--${shipData.direction}`"
    :style="styles"
  ></div>
</template>
<style scoped src="./Ship.less" />
