<script lang="ts" setup>
import { DIRECTION, SHIP, cellSize } from '@/contants'
import type { PropType } from 'vue'
import type { ShipPlacement } from '@/types'
import { computed } from 'vue'

const props = defineProps({
  boardHidden: {
    type: Boolean
  },
  direction: {
    type: String as PropType<DIRECTION>
  },
  shipData: {
    type: Object as PropType<ShipPlacement>,
    required: true
  }
})

const styles = computed(() => ({
  left: cellSize * props.shipData.position.x + 'px',
  top: cellSize * props.shipData.position.y + 'px'
}))
</script>

<template>
  <div
    v-if="shipData.status === SHIP.destroyed || !boardHidden"
    :class="['ship', `ship--${direction ?? shipData.direction}`]"
    :style="styles"
  >
    <span class="ship__cell" v-for="(_, i) in shipData.size" :key="i" />
  </div>
</template>
<style scoped src="./Ship.less" />
