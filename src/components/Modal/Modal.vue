<script lang="ts" setup>
import { ref } from 'vue'

defineProps({
  className: {
    type: String
  },
  headerClassName: {
    type: String
  },
  bodyClassName: {
    type: String
  },
  footerClassName: {
    type: String
  }
})

// keeps the status of the modal
const isShown = ref(false)
// keeps the value of the animation, we need to run: 'fadeInUp' or 'fadeOutDown'
const isAnimating = ref(false)
// animation duration
const duration = ref(300)

const openModal = () => {
  isShown.value = true
  isAnimating.value = true
}

const closeModal = () => {
  isAnimating.value = false
  setTimeout(() => {
    isShown.value = false
  }, duration.value)
}

defineExpose({ openModal, closeModal })
</script>

<template>
  <template v-if="isShown">
    <div class="modal__overlay" @click="closeModal" />
    <div class="modal-wrapper">
      <div
        :style="{ animationDuration: `${duration}ms` }"
        :class="['modal', className, isAnimating ? 'fadeInUp' : 'fadeOutDown']"
      >
        <div :class="['modal__header', headerClassName]">
          <slot name="header" />
          <span class="modal-close" @click="closeModal" />
        </div>
        <div :class="['modal__body', bodyClassName]">
          <slot name="body" />
        </div>
        <div :class="['modal__footer', footerClassName]">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </template>
</template>
<style scoped src="./Modal.less" />
