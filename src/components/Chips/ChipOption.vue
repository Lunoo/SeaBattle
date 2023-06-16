<script lang="ts" generic="T extends string" setup>
import { toRefs } from 'vue'

interface ChipOptionProps<T> {
  className?: string
  radioName: string
  selected?: T
  value: T
  onChange?: (value: T) => void
}

const props = defineProps<ChipOptionProps<T>>()
const { className, radioName = 'default', selected, value, onChange } = toRefs(props)
const handleClick = () => onChange?.value(value)
</script>

<template>
  <input type="radio" :name="radioName" :checked="selected === value" />
  <button :class="['chip-option', className]" @click="handleClick">
    <span class="chip-option__icon" />
    <slot>{{ value }}</slot>
  </button>
</template>
<style scoped src="./ChipOption.less" />
