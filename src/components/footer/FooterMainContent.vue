<template>
  <div class="footer-main">
    <div class="footer-content-wrapper">
      
      <div v-if="!isMobile" class="footer-grid">
        
        <div 
          v-for="block in columnList" 
          :key="block.id" 
          class="footer-col"
          :class="block.type" 
        >
          
          <template v-if="block.type === 'brand_block'">
            <img v-if="block.settings.logo" :src="block.settings.logo" alt="Logo" class="footer-logo" :style="{ width: block.settings.logo_width + 'px' }"/>
            <img v-else src="@/assets/logo.png" alt="Logo" class="footer-logo" :style="{ width: block.settings.logo_width + 'px' }"/>

            <p class="brand-desc">{{ block.settings.description }}</p>
            
            <div class="social-icons" v-if="block.settings.show_social">
              <i class="fab fa-facebook" v-if="block.settings.social_links?.facebook"></i>
              <i class="fab fa-twitter" v-if="block.settings.social_links?.twitter"></i>
              <i class="fab fa-instagram" v-if="block.settings.social_links?.instagram"></i>
            </div>
          </template>

          <template v-else-if="block.type === 'menu_block'">
            <h4 class="col-title">{{ block.settings.title }}</h4>
            <ul class="footer-links">
              <li v-for="link in block.settings.links" :key="link.text">
                <a :href="link.url">{{ link.text }}</a>
              </li>
            </ul>
          </template>

          <template v-else-if="block.type === 'info_block'">
            <h4 class="col-title">{{ block.settings.title }}</h4>
            <ul class="contact-list">
              <li v-if="block.settings.address">
                <el-icon><Location /></el-icon> <span>{{ block.settings.address }}</span>
              </li>
              <li v-if="block.settings.phone">
                <el-icon><Phone /></el-icon> <span>{{ block.settings.phone }}</span>
              </li>
              <li v-if="block.settings.email">
                <el-icon><Message /></el-icon> <span>{{ block.settings.email }}</span>
              </li>
            </ul>
          </template>

        </div>
      </div>

      <div v-else class="footer-mobile-accordion">
        <el-collapse v-model="activeNames">
          
          <el-collapse-item 
            v-for="(block, index) in columnList" 
            :key="block.id" 
            :name="String(index)"
          >
            <template #title>
              <span class="mobile-title" v-if="block.type === 'brand_block'">Brand Info</span>
              <span class="mobile-title" v-else>{{ block.settings.title }}</span>
            </template>

            <div class="mobile-content">
              
              <template v-if="block.type === 'brand_block'">
                <img v-if="block.settings.logo" :src="block.settings.logo" class="footer-logo mobile-logo" :style="{ width: block.settings.mobile_logo_width + 'px' }"/>
                <p class="brand-desc">{{ block.settings.description }}</p>
              </template>

              <template v-else-if="block.type === 'menu_block'">
                <ul class="footer-links">
                  <li v-for="link in block.settings.links" :key="link.text">
                    <a :href="link.url">{{ link.text }}</a>
                  </li>
                </ul>
              </template>

              <template v-else-if="block.type === 'info_block'">
                <ul class="contact-list">
                  <li v-if="block.settings.address"><el-icon><Location /></el-icon> {{ block.settings.address }}</li>
                  <li v-if="block.settings.phone"><el-icon><Phone /></el-icon> {{ block.settings.phone }}</li>
                </ul>
              </template>

            </div>
          </el-collapse-item>

        </el-collapse>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Location, Phone, Message } from '@element-plus/icons-vue'

const props = defineProps({
  isMobile: Boolean,
  settings: {
    type: Object,
    default: () => ({ columns: [] }) // 现在的结构变得非常简单，只有一个 columns 数组
  }
})

// 默认展开第一个块
const activeNames = ref(['0'])

// 计算属性：获取所有列数据
const columnList = computed(() => {
  return props.settings.columns || []
})
</script>

<style scoped>
.footer-main { background-color: #ffffff; padding: 0 20px; color: #666; }
.footer-content-wrapper { 
  max-width: 1400px; 
  margin: 0 auto; 
  padding: 50px 120px; 
  background-color: #fafafa;
  box-sizing: border-box; 
}

/* PC Layout: Flex 布局自动排列 */
.footer-grid { 
  display: flex; 
  justify-content: space-between; 
  gap: 40px; 
  flex-wrap: wrap; /* 如果加了很多块，允许换行 */
}

/* 基础列宽 */
.footer-col { flex: 1; min-width: 180px; }

/* 针对特定类型的列微调宽度 */
.footer-col.brand_block { flex: 1.5; } /* Brand 宽一点 */
.footer-col.info_block { flex: 1.2; }  /* Info 宽一点 */
.footer-col.menu_block { flex: 1; }

.col-title { color: #333; font-size: 16px; font-weight: 600; margin-bottom: 20px; text-transform: uppercase; }
.footer-logo { max-width: 180px; margin-bottom: 15px; }
.brand-desc { font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
.footer-links { list-style: none; padding: 0; margin: 0; }
.footer-links li { margin-bottom: 12px; }
.footer-links a { text-decoration: none; color: #666; font-size: 14px; transition: color 0.3s; }
.footer-links a:hover { color: #d4af37; }
.contact-list { list-style: none; padding: 0; }
.contact-list li { display: flex; align-items: flex-start; margin-bottom: 15px; font-size: 14px; gap: 10px; }
.mobile-logo { max-width: 140px; }
:deep(.el-collapse-item__header) { font-weight: 600; color: #333; font-size: 15px; background-color: #fafafa; }
:deep(.el-collapse-item__content) { background-color: #fafafa; }

@media (max-width: 768px) {
  .footer-content-wrapper { padding: 0 20px; }
  .footer-grid { flex-direction: column; }
}
</style>