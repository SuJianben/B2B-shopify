import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import HomeHero from './components/home-hero/HomeHero.vue'

const mountPoint = document.getElementById('app')

// 1. 初始化header 和 footer
if (mountPoint) {
  // 1. 寻找我们在 Liquid 里生成的 JSON 数据
  const menuScript = document.getElementById('shopify-menu-data')
  
  // 默认空数据结构
  let shopifyData = { menu: [], social: {} } 
  
  if (menuScript && menuScript.textContent) {
    try {
      // 解析新的 JSON 结构
      const parsedData = JSON.parse(menuScript.textContent)
      // 兼容判断：如果 JSON 是数组说明是旧版，如果是对象说明是新版
      if (Array.isArray(parsedData)) {
         shopifyData.menu = parsedData
      } else {
         shopifyData = parsedData
      }
      console.log('成功获取 Shopify 数据:', shopifyData)
    } catch (e) {
      console.error('解析菜单 JSON 失败:', e)
    }
  }

  // 2. 创建 App，分别传递 菜单 和 社媒数据
  const app = createApp(App, {
    menuItems: shopifyData.menu,
    socialLinks: shopifyData.social
  })

  app.use(ElementPlus)
  app.mount(mountPoint)
}

// 2. 初始化 Home Hero (新增逻辑)
const initHeroSections = () => {
  const roots = document.querySelectorAll('.vue-home-hero-root')
  
  roots.forEach(el => {
    if (el.dataset.__vueMounted) return; // 防止重复挂载

    let settings = {}
    try {
      if (el.dataset.settings) {
        settings = JSON.parse(el.dataset.settings)
      }
    } catch (e) {
      console.error('Home Hero JSON Error:', e)
    }

    const app = createApp(HomeHero, {
      sectionData: settings // 将整个大数据对象传进去
    })
    
    app.use(ElementPlus)
    app.mount(el)
    el.dataset.__vueMounted = true
  })
}

document.addEventListener('DOMContentLoaded', initHeroSections)

// 3. 监听 Shopify 编辑器事件 (实现热重载)
document.addEventListener('shopify:section:load', (e) => {
  if (e.target.querySelector('.vue-home-hero-root')) {
    initHeroSections()
  }
})