import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 1. 引入组件
import AppHeader from './App.vue' // 你的 Header
import HomeHero from './components/home-hero/HomeHero.vue'
import FeaturedProducts from './components/home-product/FeaturedProducts.vue'
import AppFooter from './components/footer/Footer.vue' // ⭐ 新增：引入 Footer 父组件

// ==========================================
// 1. 初始化 Header (保持不变)
// ==========================================
const initHeader = () => {
  const mountPoint = document.getElementById('app')
  if (mountPoint && !mountPoint.dataset.__vueMounted) {
    const menuScript = document.getElementById('shopify-menu-data')
    let shopifyData = { menu: [], social: {} } 
    
    if (menuScript && menuScript.textContent) {
      try {
        const parsedData = JSON.parse(menuScript.textContent)
        if (Array.isArray(parsedData)) {
           shopifyData.menu = parsedData
        } else {
           shopifyData = parsedData
        }
      } catch (e) {
        console.error('Header JSON Error:', e)
      }
    }

    const app = createApp(AppHeader, {
      menuItems: shopifyData.menu,
      socialLinks: shopifyData.social
    })

    app.use(ElementPlus)
    app.mount(mountPoint)
    mountPoint.dataset.__vueMounted = true
  }
}

// ==========================================
// 2. 初始化 Home Hero (保持不变)
// ==========================================
const initHeroSections = () => {
  const roots = document.querySelectorAll('.vue-home-hero-root')
  roots.forEach(el => {
    if (el.dataset.__vueMounted) return;
    let settings = {}
    try {
      if (el.dataset.settings) {
        settings = JSON.parse(el.dataset.settings)
      }
    } catch (e) {
      console.error('Home Hero JSON Error:', e)
    }
    const app = createApp(HomeHero, { sectionData: settings })
    app.use(ElementPlus)
    app.mount(el)
    el.dataset.__vueMounted = true
  })
}

// ==========================================
// 3. 初始化 Featured Products (保持不变)
// ==========================================
const initFeaturedProducts = () => {
  const roots = document.querySelectorAll('.vue-featured-products-root')
  roots.forEach(el => {
    if (el.dataset.__vueMounted) return;
    let settings = {}
    try {
      if (el.dataset.settings) {
        settings = JSON.parse(el.dataset.settings)
      }
    } catch (e) {
      console.error('Featured Products JSON Error:', e)
    }
    const app = createApp(FeaturedProducts, { data: settings })
    app.use(ElementPlus)
    app.mount(el)
    el.dataset.__vueMounted = true
  })
}

// ==========================================
// 4. ⭐ 初始化 Footer (新增)
// ==========================================
const initFooter = () => {
  // 这里的 ID 'vue-footer-root' 对应我们在 liquid 里写的 <div id="vue-footer-root">
  const root = document.getElementById('vue-footer-root')
  
  if (root && !root.dataset.__vueMounted) {
    let settings = {}
    // 如果之后转 Liquid 传了数据，这里可以解析。现在 Vue 测试阶段哪怕为空也没事。
    try {
      if (root.dataset.settings) {
        settings = JSON.parse(root.dataset.settings)
      }
    } catch (e) {
      console.error('Footer JSON Error:', e)
    }

    const app = createApp(AppFooter, { settings }) // 创建 Footer 应用
    app.use(ElementPlus) // Footer 也需要 Element Plus (因为有弹窗和图标)
    app.mount(root)
    root.dataset.__vueMounted = true
  }
}

// ==========================================
// 5. 事件监听 (统一执行)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initHeader()
  initHeroSections()
  initFeaturedProducts()
  initFooter() // ⭐ 启动 Footer
})

// 监听 Shopify 编辑器事件 (热重载)
document.addEventListener('shopify:section:load', (e) => {
  const target = e.target
  
  // 检查是不是 Hero
  if (target.querySelector('.vue-home-hero-root')) {
    initHeroSections()
  }
  // 检查是不是 Product
  if (target.querySelector('.vue-featured-products-root')) {
    initFeaturedProducts()
  }
  // ⭐ 检查是不是 Footer
  if (target.querySelector('#vue-footer-root')) {
    initFooter()
  }
})