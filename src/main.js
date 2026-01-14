import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// ==========================================
// A. 引入旧组件 (保持原有逻辑)
// ==========================================
import AppHeader from './App.vue';
import HomeHero from './components/home-hero/HomeHero.vue';
import ProductDetail from './components/product/ProductDetail.vue'; 
import FeaturedProducts from './components/home-product/FeaturedProducts.vue';
import HomeAbout from './components/home-about/HomeAbout.vue' 
import HomeRecommended from './components/home-recommended/HomeRecommended.vue' 
import HomeNews from './components/home-news/HomeNews.vue' 
import HomeLogos from './components/home-logos/HomeLogos.vue' 
import CollectionDetail from './components/collection/CollectionDetail.vue';
import AppFooter from './components/footer/Footer.vue';

// ==========================================
// B. 引入新组件 (About 页面用)
// ==========================================
import BreadcrumbBanner from './components/product/BreadcrumbBanner.vue'; // 确保路径正确
import AboutContent from './components/page/about/AboutContent.vue';         // 刚才新建的
import ContactForm from './components/page/about/ContactForm.vue';           // 刚才新建的
import ContactInfo from './components/page/contact/ContactInfo.vue';

// ==========================================
// 1. 旧的初始化函数 (原封不动，保证首页不崩)
// ==========================================
const initHeader = () => {
  const mountPoint = document.getElementById('app');
  if (mountPoint && !mountPoint.dataset.__vueMounted) {
    const menuScript = document.getElementById('shopify-menu-data');
    let shopifyData = { menu: [], social: {} };
    if (menuScript && menuScript.textContent) {
      try {
        const parsedData = JSON.parse(menuScript.textContent);
        if (Array.isArray(parsedData)) { shopifyData.menu = parsedData; } 
        else { shopifyData = parsedData; }
      } catch (e) { console.error('Header JSON Error:', e); }
    }
    const app = createApp(AppHeader, { menuItems: shopifyData.menu, socialLinks: shopifyData.social });
    app.use(ElementPlus);
    app.mount(mountPoint);
    mountPoint.dataset.__vueMounted = true;
  }
};

const initHeroSections = () => {
  document.querySelectorAll('.vue-home-hero-root').forEach((el) => {
    if (el.dataset.__vueMounted) return;
    let settings = {};
    try { if (el.dataset.settings) settings = JSON.parse(el.dataset.settings); } catch (e) {}
    const app = createApp(HomeHero, { sectionData: settings });
    app.use(ElementPlus);
    app.mount(el);
    el.dataset.__vueMounted = true;
  });
};

const initProductApp = () => {
  const root = document.getElementById('vue-product-app');
  if (!root || root.dataset.__vueMounted) return;
  try {
    const productData = JSON.parse(root.dataset.product || '{}');
    const breadcrumbsData = JSON.parse(root.dataset.breadcrumbs || '[]');
    const bannerImg = root.dataset.bannerImg || '';
    const app = createApp(ProductDetail, { productData, breadcrumbsData, bannerImg });
    app.use(ElementPlus);
    app.mount(root);
    root.dataset.__vueMounted = true;
  } catch (e) { console.error(e); }
};

const initFeaturedProducts = () => {
  document.querySelectorAll('.vue-featured-products-root').forEach(el => {
    if (el.dataset.__vueMounted) return;
    let settings = {};
    try { if (el.dataset.settings) settings = JSON.parse(el.dataset.settings); } catch (e) {}
    const app = createApp(FeaturedProducts, { data: settings });
    app.use(ElementPlus);
    app.mount(el);
    el.dataset.__vueMounted = true;
  });
};

const initRecommended = () => {
  document.querySelectorAll('.vue-home-recommended-root').forEach(el => {
    if (el.dataset.__vueMounted) return;
    let settings = {};
    try { if (el.dataset.settings) settings = JSON.parse(el.dataset.settings); } catch (e) {}
    const app = createApp(HomeRecommended, { data: settings });
    app.use(ElementPlus);
    app.mount(el);
    el.dataset.__vueMounted = true;
  })
}

const initHomeAbout = () => {
  document.querySelectorAll('.vue-home-about-root').forEach(el => {
    if (el.dataset.__vueMounted) return;
    let settings = {};
    try { if (el.dataset.settings) settings = JSON.parse(el.dataset.settings); } catch (e) {}
    const app = createApp(HomeAbout, { settings });
    app.use(ElementPlus);
    app.mount(el);
    el.dataset.__vueMounted = true;
  })
}

const initNews = () => {
  document.querySelectorAll('.vue-home-news-root').forEach(el => {
    if (el.dataset.__vueMounted) return;
    let settings = {};
    try { if (el.dataset.settings) settings = JSON.parse(el.dataset.settings); } catch (e) {}
    const app = createApp(HomeNews, { data: settings });
    app.use(ElementPlus);
    app.mount(el);
    el.dataset.__vueMounted = true;
  })
}

const initLogos = () => {
  document.querySelectorAll('.vue-home-logos-root').forEach(el => {
    if (el.dataset.__vueMounted) return;
    let settings = {};
    try { if (el.dataset.settings) settings = JSON.parse(el.dataset.settings); } catch (e) {}
    const app = createApp(HomeLogos, { data: settings });
    app.mount(el);
    el.dataset.__vueMounted = true;
  })
}

const initCollectionApp = () => {
  const root = document.getElementById('vue-collection-app');
  if (!root || root.dataset.__vueMounted) return;
  try {
    const productsData = JSON.parse(root.dataset.products || '[]');
    const breadcrumbsData = JSON.parse(root.dataset.breadcrumbs || '[]');
    const bannerImg = root.dataset.bannerImg || '';
    const sidebarMenu = JSON.parse(root.dataset.sidebarMenu || '[]');
    const sidebarRec = JSON.parse(root.dataset.sidebarRec || '[]');
    const sidebarRecTitle = root.dataset.sidebarRecTitle || 'RECOMMENDED';
    const collectionTitle = root.dataset.collectionTitle || 'Collection';
    const paginationData = JSON.parse(root.dataset.pagination || '{}');
    const app = createApp(CollectionDetail, {
      collectionTitle, productsData, breadcrumbsData, bannerImg,
      sidebarMenu, sidebarRec, sidebarRecTitle, paginationData
    });
    app.use(ElementPlus);
    app.mount(root);
    root.dataset.__vueMounted = true;
  } catch (e) { console.error(e); }
};

const initFooter = () => {
  const root = document.getElementById('vue-footer-root');
  if (root && !root.dataset.__vueMounted) {
    let settings = {};
    try { if (root.dataset.settings) settings = JSON.parse(root.dataset.settings); } catch (e) {}
    const app = createApp(AppFooter, { settings });
    app.use(ElementPlus);
    app.mount(root);
    root.dataset.__vueMounted = true;
  }
};

// ==========================================
// 2. ⭐ 新增：通用挂载逻辑 (只给 About 页面用)
// ==========================================

// 注册表：只放新的组件，或者你确定已经改了 Liquid 的组件
const NEW_COMPONENTS = {
  'BreadcrumbBanner': BreadcrumbBanner,
  'AboutContent': AboutContent,
  'ContactForm': ContactForm,
  'ContactInfo': ContactInfo,
};

const mountGenericSections = () => {
  // 查找带有 .vue-section-root 的元素 (这是我在 About 页面 Liquid 里让你加的 class)
  const roots = document.querySelectorAll('.vue-section-root');

  roots.forEach(el => {
    if (el.dataset.__vueMounted) return;

    const componentName = el.dataset.component;
    const Component = NEW_COMPONENTS[componentName]; // 只去新注册表里找

    if (Component) {
      let props = {};
      try {
        if (el.dataset.props) props = JSON.parse(el.dataset.props);
      } catch (e) { console.error('Generic Props Error', e); }

      const app = createApp(Component, props);
      app.use(ElementPlus);
      app.mount(el);
      el.dataset.__vueMounted = true;
    }
  });
};

// ==========================================
// 3. 执行所有初始化
// ==========================================
const initAll = () => {
  // --- 旧页面逻辑 (保持不变) ---
  initHeader();
  initHeroSections();
  initProductApp();
  initFeaturedProducts();
  initHomeAbout();
  initRecommended();
  initNews();
  initLogos();
  initCollectionApp();
  initFooter();

  // --- 新页面逻辑 (About) ---
  mountGenericSections(); 
};

document.addEventListener('DOMContentLoaded', initAll);

// Shopify 编辑器热重载支持
document.addEventListener('shopify:section:load', (e) => {
  const target = e.target;
  
  // 尝试运行通用挂载 (About 页面的热重载)
  mountGenericSections();

  // 旧页面的热重载检查 (保持不变)
  if (target.querySelector('.vue-home-hero-root')) initHeroSections();
  if (target.querySelector('#vue-product-app') || target.id === 'vue-product-app') initProductApp();
  if (target.querySelector('.vue-featured-products-root')) initFeaturedProducts();
  if (target.querySelector('.vue-home-about-root')) initHomeAbout();
  if (target.querySelector('.vue-home-recommended-root')) initRecommended();
  if (target.querySelector('.vue-home-news-root')) initNews();
  if (target.querySelector('.vue-home-logos-root')) initLogos();
  if (target.querySelector('#vue-footer-root')) initFooter();
});