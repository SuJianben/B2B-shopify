<template>
  <footer class="site-footer">
    
    <FooterTopBar @open-contact="dialogVisible = true" />

    <FooterMainContent :isMobile="isMobile" />

    <FooterCopyright />

    <ContactModal v-model:visible="dialogVisible" />

  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 引入子组件
import FooterTopBar from './FooterTopBar.vue'
import FooterMainContent from './FooterMainContent.vue'
import FooterCopyright from './FooterCopyright.vue'
import ContactModal from './ContactModal.vue'

// === 全局状态 ===
const dialogVisible = ref(false)

// === 响应式逻辑 (判断手机端) ===
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value <= 990) // 使用 990px 作为断点

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<style scoped>
.site-footer {
  width: 100%;
  margin-top: 60px; /* 与上方分区的间距 */
}
</style>