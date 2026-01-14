<template>
  <div class="about-section-container">
    <div class="text-content">
      <h2 class="section-title" v-if="title">{{ title }}</h2>
      <div class="rte-content" v-html="content"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  content: { type: String, default: '' }
})
</script>

<style scoped>
.about-section-container {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}
.section-title {
  font-size: 32px;
  text-transform: uppercase;
  margin-bottom: 30px;
  font-weight: 700;
  border-bottom: 2px solid #333;
  display: inline-block;
  padding-bottom: 5px;
}
.rte-content {
  font-size: 16px;
  line-height: 1.8;
  color: #444;
  text-align: justify;
}
</style>