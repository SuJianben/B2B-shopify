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
  width: 100%; /* ⭐ 关键：占满屏幕宽度 */
  padding: 30px 0;
  color: #ffffff;
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

@media (max-width: 990px) {
  .cta-inner { flex-direction: column; gap: 15px; text-align: center; padding: 0 20px; }
  .cta-text { font-size: 18px; }
}
</style>