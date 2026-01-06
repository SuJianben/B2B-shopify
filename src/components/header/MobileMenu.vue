<template>
  <el-drawer
    v-model="isVisible"
    direction="ltr"
    size="80%"
    :with-header="false"
    class="mobile-drawer"
    :append-to-body="true"
  >
    <div class="drawer-content">
      <div class="drawer-header">
         <span class="drawer-title">MENU</span>
         <el-button link @click="close">
           <el-icon :size="24"><Close /></el-icon>
         </el-button>
      </div>

      <el-menu class="mobile-menu-list" :default-active="activePath">
         <template v-for="(item, index) in menuItems" :key="index">
            <el-sub-menu v-if="item.children && item.children.length > 0" :index="String(index)">
              <template #title>
                 <span class="mobile-menu-text">{{ item.label }}</span>
              </template>
              <el-menu-item v-for="(child, cIndex) in item.children" :key="`${index}-${cIndex}`" :index="`${index}-${cIndex}`">
                <a :href="child.url" class="mobile-sub-link">{{ child.label }}</a>
              </el-menu-item>
            </el-sub-menu>

            <el-menu-item v-else :index="String(index)">
               <a :href="item.url" class="mobile-menu-link">{{ item.label }}</a>
            </el-menu-item>
         </template>
      </el-menu>

      <div class="drawer-footer">
         <div class="drawer-phone">
            <el-icon><PhoneFilled /></el-icon> 020-88888888
         </div>
         
         <div class="drawer-socials">
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
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue'
import { PhoneFilled, Close } from '@element-plus/icons-vue'

// 接收父组件传来的数据
defineProps({
  menuItems: { type: Array, default: () => [] },
  socialLinks: { type: Object, default: () => ({}) }
})

const isVisible = ref(false)
const activePath = ref('') // 可选：用于高亮当前页面

// 暴露给父组件的方法
const open = () => { isVisible.value = true }
const close = () => { isVisible.value = false }

defineExpose({ open, close })
</script>

<style scoped>
/* 侧滑菜单整体容器 */
.drawer-content { display: flex; flex-direction: column; height: 100%; }

/* 头部 */
.drawer-header { padding: 0 20px; height: 60px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; }
.drawer-title { font-weight: bold; font-size: 16px; color: #999; }

/* 菜单列表区域 */
.mobile-menu-list { border-right: none !important; flex: 1; overflow-y: auto; }

/* 菜单项样式 */
:deep(.el-menu-item), :deep(.el-sub-menu__title) { 
  height: 50px; 
  line-height: 50px; 
  font-size: 16px; 
  font-weight: 500; 
  border-bottom: 1px solid #f9f9f9; 
  color: #333;
}
/* 链接填充满 */
.mobile-menu-link, .mobile-sub-link { text-decoration: none; color: inherit; display: block; width: 100%; height: 100%; }

/* 底部区域 */
.drawer-footer { padding: 20px; background: #f9f9f9; border-top: 1px solid #eee; }
.drawer-phone { display: flex; align-items: center; font-weight: bold; margin-bottom: 20px; font-size: 18px; color: #333; }
.drawer-phone .el-icon { margin-right: 10px; color: #d4af37; }

/* 社媒容器 */
.drawer-socials { display: flex; gap: 15px; }

/* 社媒图标 (复用样式) */
.social-icon { 
  width: 36px; height: 36px; 
  border: 1px solid #eee; 
  border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; 
  color: #999; text-decoration: none; 
  transition: all 0.3s ease-in-out; 
  background: #fff;
}
.social-icon:hover { 
  color: #111; border-color: #111; 
  transform: scale(1.15) rotate(15deg); 
}
</style>