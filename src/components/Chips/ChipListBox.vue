<script lang="ts" generic="T extends string" setup>
interface ChipListBoxProps<T> {
  className?: string
  name?: string
  selected: T
  onChange: (value: T) => void
}

defineProps<ChipListBoxProps<T>>()
</script>

<template>
  <fieldset :class="['chip-list-box', className]">
    <slot :radio-name="name ?? 'default'" :selected="selected" :on-change="onChange" />
  </fieldset>
</template>
<style scoped src="./ChipListBox.less"></style>
