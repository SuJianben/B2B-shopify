<template>
  <div class="app-wrapper">
    
    <div class="site-container">
      
      <AppHeader 
        :menuItems="menuItems" 
        :socialLinks="socialLinks" 
      />

    </div>

  </div>
</template>

<script setup>
import AppHeader from './components/header/Header.vue'

defineProps({
  menuItems: { type: Array, default: () => [] },
  socialLinks: { type: Object, default: () => ({}) }
})
</script>

<style>
</style>