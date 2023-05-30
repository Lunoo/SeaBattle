<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  className: {
    type: String
  },
  radioName: {
    type: String
  },
  selected: {
    type: String
  },
  value: {
    type: String
  },
  onChange: {
    type: Function as PropType<(value?: string) => void>
  }
})
</script>

<template>
  <input type="radio" :name="radioName" :checked="selected === value" />
  <button :class="['chip-option', className]" @click="onChange?.(value)">
    <span class="chip-option__icon" />
    <slot>{{ value }}</slot>
  </button>
</template>
<style scoped src="./ChipOption.less" />
