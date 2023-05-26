<script lang="ts" setup>
defineEmits(['toggle-settings'])
</script>

<template>
  <header class="header">
    <h1>Sea Battle</h1>
    <button class="header__settings" @click="$emit('toggle-settings')" />
  </header>
</template>
<style src="./TheHeader.less" />
