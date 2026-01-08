<template>
  <div class="footer-cta-bar">
    <div class="cta-inner">
      <h3 class="cta-text">Wants to Start your Own Web Store, Today?</h3>
      <el-button class="cta-btn" @click="$emit('open-contact')">CONTACT US</el-button>
    </div>
  </div>
</template>

<style scoped>
/* 1. 外层容器：负责背景色，强制 100% 宽度 */
.footer-cta-bar {
  background-color: #000000;
  width: auto; 
  padding: 40px 0;
  color: #ffffff;
  margin-left: -80px;
  margin-right: -80px;

  /* ⭐ 2. 核心优化：添加过渡动画 === */
  /* 当 margin 发生变化时，用 0.5秒的时间平滑过渡 */
  /* cubic-bezier 能带来类似“弹簧”或“惯性”的高级感，比 linear 更自然 */
  transition: margin 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), width 0.5s ease;
  
  /* 性能优化：告诉浏览器这个属性会变，提前准备 */
  will-change: margin;
}

/* 2. 内层容器：负责限制内容宽度，保持与下方内容对齐 */
.cta-inner {
  max-width: 1400px; /* ⭐ 保持这个宽度限制 */
  width: 100%;       /* 确保在小屏幕下也能占满 */
  margin: 0 auto;    /* 居中 */
  padding: 0 60px;   /* ⭐ 这里也加宽一点内边距，防止文字贴边 */
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box; /* 防止 padding 撑大宽度 */
}

.cta-text { font-size: 24px; font-weight: 700; margin: 0; }
.cta-btn {
  background-color: #d4af37;
  border: none;
  color: #fff;
  font-weight: 600;
  padding: 20px 30px;
  border-radius: 0;
}
.cta-btn:hover { background-color: #c19b2e; }

/* ⭐ 响应式安全网 (非常重要！) */
/* 当屏幕宽度不足以支撑“突出”的效果时（比如笔记本或平板），取消突出，恢复平齐 */
/* 1400px (内容) + 160px (两边突出) = 1560px */
@media (max-width: 1600px) {
  .footer-cta-bar {
    /* ⭐ 优化策略：与其“缩回”内容宽度，不如直接“铺满”屏幕 */
    /* 这样用户缩放时，感觉是黑条“无缝对接”到了屏幕边缘，而不是突然断掉 */
    
    margin-left: calc(50% - 50vw);  /* 强制拉伸到屏幕最左边 */
    margin-right: calc(50% - 50vw); /* 强制拉伸到屏幕最右边 */
    width: 100vw;                   /* 宽度变为视口宽度 */
  }
}

@media (max-width: 990px) {
  .cta-inner { flex-direction: column; gap: 15px; text-align: center; padding: 0 20px; }
  .cta-text { font-size: 18px; }
}
</style>