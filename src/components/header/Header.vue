<template>
  <header class="header-wrapper">
    
    <div class="header-pc hidden-mobile">
      <div class="header-white-box">
        <div class="header-top">
          <div class="top-item left-item">
            <div class="icon-circle"><el-icon><PhoneFilled /></el-icon></div>
            <div class="phone-info">
              <span class="label">Call on order</span>
              <span class="number">020-88888888</span>
            </div>
          </div>

          <div class="top-item center-item">
            <a href="/" class="logo-link">
              <img src="@/assets/logo.png" alt="Logo" class="main-logo deep-shift" />
            </a>
          </div>

          <div class="top-item right-item">
            <a v-if="socialLinks.facebook" :href="socialLinks.facebook" target="_blank" class="social-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a v-if="socialLinks.twitter" :href="socialLinks.twitter" target="_blank" class="social-icon">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </a>
            <a v-if="socialLinks.youtube" :href="socialLinks.youtube" target="_blank" class="social-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.83l6.25 3.09z"></path></svg>
            </a>
            <a v-if="socialLinks.instagram" :href="socialLinks.instagram" target="_blank" class="social-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" stroke-width="2"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2"></line></svg>
            </a>
          </div>
        </div>
        <div class="header-divider"></div>
        <div class="header-bottom">
          <div class="nav-container">
            <el-menu mode="horizontal" :ellipsis="false" class="custom-menu">
              <template v-for="(item, index) in menuItems" :key="index">
                <el-sub-menu v-if="item.children && item.children.length > 0" :index="String(index)">
                  <template #title><a :href="item.url" class="menu-link">{{ item.label }}</a></template>
                  <el-menu-item v-for="(child, cIndex) in item.children" :key="`${index}-${cIndex}`" :index="`${index}-${cIndex}`">
                    <a :href="child.url" class="block-link">{{ child.label }}</a>
                  </el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :index="String(index)">
                  <a :href="item.url" class="menu-link">{{ item.label }}</a>
                </el-menu-item>
              </template>
            </el-menu>
            <div class="nav-separator"></div>
            <div class="search-section">
              <el-button link class="search-icon-btn" @click="handleOpenSearch">
                <el-icon :size="20"><Search /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="header-mobile hidden-desktop">
      <div class="mobile-left">
        <el-button link class="hamburger-btn" @click="handleOpenDrawer">
          <el-icon :size="24"><Menu /></el-icon>
        </el-button>
      </div>

      <div class="mobile-center">
        <a href="/" class="mobile-logo-link">
          <img src="@/assets/logo.png" alt="Logo" class="mobile-logo" />
        </a>
      </div>

      <div class="mobile-right">
        <el-button link class="mobile-search-btn" @click="handleOpenSearch">
          <el-icon :size="22"><Search /></el-icon>
        </el-button>
      </div>
    </div>

    <MobileMenu 
      ref="mobileMenuRef" 
      :menuItems="menuItems" 
      :socialLinks="socialLinks"
    />
    
    <SearchModal ref="searchRef" />
    

  </header>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { PhoneFilled, Search, Menu } from '@element-plus/icons-vue'
import SearchModal from '../search/Search.vue'
import MobileMenu from './MobileMenu.vue' // ⭐ 引入新组件

defineProps({
  menuItems: { type: Array, default: () => [] },
  socialLinks: { type: Object, default: () => ({}) }
})

// 组件引用
const searchRef = ref(null)
const mobileMenuRef = ref(null)

// 动作处理
const handleOpenSearch = () => {
  if (searchRef.value) searchRef.value.open()
}

const handleOpenDrawer = () => {
  if (mobileMenuRef.value) mobileMenuRef.value.open()
}
</script>

<style scoped>
/* Header 专属样式（已经移除了所有 Drawer 相关样式） */
.header-wrapper { width: 100%; background-color: transparent; padding-top: 0; position: relative; z-index: 100; }
@media (max-width: 990px) { .hidden-mobile { display: none !important; } }

.header-white-box { background-color: #ffffff; max-width: 1400px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
.header-top { display: flex; justify-content: space-between; align-items: center; height: 140px; padding: 0 80px; }
.left-item, .right-item { flex: 1; width: 0; display: flex; align-items: center; }
.left-item { justify-content: flex-start; }
.right-item { justify-content: flex-end; gap: 12px; }
.center-item { flex: 0 0 auto; position: relative; z-index: 10; text-align: center; }
.main-logo { height: 70px; display: block; }
.deep-shift { margin-top: 45px; transition: transform 0.3s; }
.deep-shift:hover { transform: translateY(2px); }
.icon-circle { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; }
.phone-info { display: flex; flex-direction: column; }
.label { font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
.number { font-size: 20px; font-weight: 700; color: #333; }
.social-icon { width: 36px; height: 36px; border: 1px solid #eee; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #999; text-decoration: none; transition: all 0.3s ease-in-out; }
.social-icon:hover { color: #111; border-color: #111; transform: scale(1.15) rotate(15deg); }
.left-item:hover .icon-circle .el-icon { animation: wiggle 0.5s ease-in-out both; }
@keyframes wiggle { 0% { transform: rotate(0deg); } 20% { transform: rotate(-15deg); } 40% { transform: rotate(15deg); } 60% { transform: rotate(-10deg); } 80% { transform: rotate(10deg); } 100% { transform: rotate(0deg); } }

.header-divider { height: 1px; background-color: #f0f0f0; width: 100%; }
.header-bottom { display: flex; justify-content: center; align-items: center; height: 65px; }
.nav-container { display: flex; align-items: center; }
.custom-menu { border: none !important; background: transparent !important; height: 65px; display: flex; align-items: center; }
:deep(.el-menu-item), :deep(.el-sub-menu__title) { background: transparent !important; font-size: 15px; font-weight: 600; padding: 0 20px !important; letter-spacing: 0.5px; }
:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) { color: #d4af37 !important; }
.nav-separator { width: 1px; height: 18px; background-color: #e0e0e0; margin: 0 10px 0 20px; }
.search-icon-btn { color: #333; padding: 8px; }
.search-icon-btn:hover { color: #d4af37; }
.menu-link, .block-link { text-decoration: none; color: inherit; display: block; width: 100%; height: 100%; display: flex; align-items: center;}

/* === 修复 PC 二级菜单箭头重叠 Bug === */
.custom-menu :deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
  position: static !important; margin-left: 6px !important; margin-top: -2px !important; right: auto !important;
}
.custom-menu :deep(.el-sub-menu__title) { display: flex !important; align-items: center !important; justify-content: center !important; }

/* === Mobile 布局条 (Top Bar) === */
@media (min-width: 991px) { .hidden-desktop { display: none !important; } }
.header-mobile { background: #fff; height: 80px; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 1px solid #eee; box-shadow: 0 2px 5px rgba(0,0,0,0.03); }
.mobile-left, .mobile-right { flex: 0 0 40px; display: flex; align-items: center; }
.mobile-right { justify-content: flex-end; }
.hamburger-btn, .mobile-search-btn { padding: 0; color: #333; }
.mobile-center { flex: 1; text-align: center; }
.mobile-logo { height: 60px; object-fit: contain; }
</style>