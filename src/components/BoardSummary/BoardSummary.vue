<script lang="ts" setup>
import { BOARD_TYPES, DIRECTION, SHIP } from '@/contants'
import type { PropType } from 'vue'
import Ship from '@/components/Ship/Ship.vue'
import type { ShipPlacement } from '@/types'
import { computed } from 'vue'

const props = defineProps({
  boardType: {
    type: String as PropType<BOARD_TYPES>,
    required: true
  },
  ships: {
    type: Object as PropType<ShipPlacement[]>,
    required: true
  },
  shipSizes: {
    type: Object as PropType<number[]>,
    required: true
  }
})

const shipsTotal = computed(() =>
  props.ships.reduce(
    (acc, ship) => {
      if (ship.status === SHIP.destroyed) {
        let shipsNumber = acc.shipsDestroyed.get(ship.size) ?? 0
        acc.shipsDestroyed.set(ship.size, ++shipsNumber)
      } else {
        let shipsNumber = acc.shipsLeft.get(ship.size) ?? 0
        acc.shipsLeft.set(ship.size, ++shipsNumber)
      }

      return acc
    },
    {
      shipsLeft: new Map<number, number>(),
      shipsDestroyed: new Map<number, number>()
    }
  )
)

const shouldShow = computed(
  () => !!shipsTotal.value.shipsLeft.size || !!shipsTotal.value.shipsDestroyed.size
)

const getDummyShipData = (index: number, size: number): ShipPlacement => ({
  direction: DIRECTION.horizontal,
  position: { x: 0, y: 0 },
  status: SHIP.alive,
  index,
  size
})
</script>

<template>
  <div :class="`board--summary ${shouldShow ? 'board--summary-opened' : ''} board-${boardType}`">
    <div class="board--summary-inner">
      <h5 v-if="shipsTotal.shipsLeft.size > 0" class="board--summary-left">Left:</h5>
      <div
        class="ship--container"
        v-for="([size, shipsNumber], i) in shipsTotal.shipsLeft.entries()"
        :key="i"
      >
        <ship :ship-data="getDummyShipData(i, size)" :direction="DIRECTION.horizontal" />
        x {{ shipsNumber }}
      </div>
      <h5 v-if="shipsTotal.shipsDestroyed.size > 0" class="board--summary-destroyed">Destroyed:</h5>
      <div
        class="ship--container"
        v-for="([size, shipsNumber], i) in shipsTotal.shipsDestroyed.entries()"
        :key="i"
      >
        <ship :ship-data="getDummyShipData(i, size)" :direction="DIRECTION.horizontal" />
        x {{ shipsNumber }}
      </div>
    </div>
  </div>
</template>

<style scoped src="./BoardSummary.less" />
