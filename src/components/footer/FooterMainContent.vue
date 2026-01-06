<template>
  <div class="footer-main">
    <div class="footer-content-wrapper">
      
      <div v-if="!isMobile" class="footer-grid">
        <div class="footer-col brand-col">
          <img src="@/assets/logo.png" alt="Logo" class="footer-logo" />
          <p class="brand-desc">Claritas processus dynamicus recmicus sequitu cmicus qituconsut.</p>
        </div>

        <div class="footer-col">
          <h4 class="col-title">ABOUT</h4>
          <ul class="footer-links">
            <li v-for="link in menuLinks.about" :key="link.text"><a :href="link.url">{{ link.text }}</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="col-title">PRODUCTS</h4>
          <ul class="footer-links">
            <li v-for="link in menuLinks.products" :key="link.text"><a :href="link.url">{{ link.text }}</a></li>
          </ul>
        </div>

        <div class="footer-col info-col">
          <h4 class="col-title">Store Information</h4>
          <ul class="contact-list">
            <li><el-icon><Location /></el-icon> <span>Guangzhou City, Guangdong</span></li>
            <li><el-icon><Phone /></el-icon> <span>020-88888888</span></li>
            <li><el-icon><Message /></el-icon> <span>youweb@qq.com</span></li>
          </ul>
        </div>
      </div>

      <div v-else class="footer-mobile-accordion">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template #title><span class="mobile-title">Store Information & Logo</span></template>
            <div class="mobile-content">
              <img src="@/assets/logo.png" alt="Logo" class="footer-logo mobile-logo" />
              <p class="brand-desc">Claritas processus dynamicus recmicus sequitu cmicus qituconsut.</p>
              <ul class="contact-list">
                <li><el-icon><Location /></el-icon> Guangzhou City</li>
                <li><el-icon><Phone /></el-icon> 020-88888888</li>
              </ul>
            </div>
          </el-collapse-item>

          <el-collapse-item title="ABOUT" name="2">
            <ul class="footer-links">
              <li v-for="link in menuLinks.about" :key="link.text"><a :href="link.url">{{ link.text }}</a></li>
            </ul>
          </el-collapse-item>

          <el-collapse-item title="PRODUCTS" name="3">
            <ul class="footer-links">
              <li v-for="link in menuLinks.products" :key="link.text"><a :href="link.url">{{ link.text }}</a></li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Location, Phone, Message } from '@element-plus/icons-vue'

defineProps({
  isMobile: Boolean
})

// 手机端默认展开第一项
const activeNames = ref(['1'])

// 模拟菜单数据
const menuLinks = {
  about: [
    { text: 'About Us', url: '#' },
    { text: 'Delivery Information', url: '#' },
    { text: 'Privacy Policy', url: '#' }
  ],
  products: [
    { text: 'Scissor Lift', url: '#' },
    { text: 'Air Blower', url: '#' },
    { text: 'Excavator', url: '#' }
  ]
}
</script>

<style scoped>
.footer-main { background-color: #ffffff; padding: 0px 20px; color: #666; }
.footer-content-wrapper { max-width: 1400px; margin: 0 auto; padding: 50px 120px; background-color: #fafafa; }

/* PC Grid */
.footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 40px; }
.col-title { color: #333; font-size: 16px; font-weight: 600; margin-bottom: 20px; text-transform: uppercase; }
.footer-logo { max-width: 180px; margin-bottom: 15px; }
.brand-desc { font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
.footer-links { list-style: none; padding: 0; margin: 0; }
.footer-links li { margin-bottom: 12px; }
.footer-links a { text-decoration: none; color: #666; font-size: 14px; transition: color 0.3s; }
.footer-links a:hover { color: #d4af37; }

.contact-list { list-style: none; padding: 0; }
.contact-list li { display: flex; align-items: flex-start; margin-bottom: 15px; font-size: 14px; gap: 10px; }

/* Mobile */
.mobile-logo { max-width: 140px; }
:deep(.el-collapse-item__header) { font-weight: 600; color: #333; font-size: 15px; }

@media (max-width: 768px) {
  .footer-content-wrapper {
    padding: 0 20px; /* 手机端改回 20px，否则内容太窄了 */
  }
}
</style>