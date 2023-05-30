<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  className: {
    type: String
  },
  name: {
    type: String,
    default: () => 'default'
  },
  selected: {
    type: String
  },
  onChange: {
    type: Function as PropType<(value: string) => void>,
    required: true
  }
})
</script>

<template>
  <fieldset :class="['chip-list-box', className]">
    <slot :radio-name="name" :selected="selected" :on-change="onChange" />
  </fieldset>
</template>
<style scoped src="./ChipListBox.less"></style>
