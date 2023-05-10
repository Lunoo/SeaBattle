<script lang="ts" setup>
defineEmits(['new-game', 'start-game'])
</script>

<template>
  <div class="ConfigurationPanel">
    <button @click="$emit('new-game')">New game</button>
    <button @click="$emit('start-game')">Start</button>
  </div>
</template>
<style scoped src="./ConfigurationPanel.less" />
