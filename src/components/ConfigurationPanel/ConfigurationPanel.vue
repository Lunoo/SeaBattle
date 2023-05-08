<template>
  <div class="ConfigurationPanel">
    <button @click="$emit('new-game')">New game</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfigurationPanel'
})
</script>

<style scoped src="./ConfigurationPanel.less" />
