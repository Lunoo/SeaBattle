<script lang="ts" setup>
import { BOARD_CONFIGURATION, BOARD_TYPES, GAME_MODE } from '@/contants'
import ChipListBox from '../Chips/ChipListBox.vue'
import ChipOption from '../Chips/ChipOption.vue'
import type { Configuration } from '@/types'
import Modal from '../Modal/Modal.vue'
import type { PropType } from 'vue'
import { ref } from 'vue'

defineProps({
  config: {
    type: Object as PropType<Configuration>,
    required: true
  },
  changeMode: {
    type: Function as PropType<(value: GAME_MODE) => void>,
    required: true
  },
  changeSize: {
    type: Function as PropType<(value: BOARD_TYPES) => void>,
    required: true
  }
})

const modalRef = ref<Modal>(null)

const openModal = () => {
  modalRef.value?.openModal()
}

defineExpose({ openModal })
</script>

<template>
  <modal class-name="settings" ref="modalRef">
    <template #header><h3>Settings</h3></template>
    <template #body>
      <div class="settings__form-item">
        <div class="settings__form-item__label">Difficulty:</div>
        <chip-list-box
          name="mode"
          :selected="config.mode"
          :on-change="changeMode"
          v-slot="chipProps"
        >
          <chip-option class-name="easy" v-bind="chipProps" :value="GAME_MODE.easy" />
          <chip-option class-name="hard" v-bind="chipProps" :value="GAME_MODE.hard" />
        </chip-list-box>
      </div>
      <div class="settings__form-item">
        <div class="settings__form-item__label">Board size:</div>
        <chip-list-box
          class-name="settings__form-item__size-select"
          name="boardSize"
          :selected="config.boardType"
          :on-change="changeSize"
          v-slot="chipProps"
        >
          <chip-option
            v-for="boardType in Object.keys(BOARD_CONFIGURATION)"
            v-bind="chipProps"
            :key="boardType"
            :value="boardType"
            >{{ BOARD_CONFIGURATION[boardType].name }}</chip-option
          >
        </chip-list-box>
      </div>
    </template>
  </modal>
</template>
<style src="./SettingsModal.less" />
