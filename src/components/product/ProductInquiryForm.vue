<template>
  <div class="inquiry-form-wrapper">
    <div class="form-header">
      Leave Your Message
    </div>

    <form 
      method="post" 
      action="/contact#contact_form" 
      id="contact_form" 
      accept-charset="UTF-8" 
      class="contact-form"
    >
      <input type="hidden" name="form_type" value="contact" />
      <input type="hidden" name="utf8" value="✓" />

      <div class="form-body">
        
        <div class="form-item">
          <el-input 
            v-model="formData.productName" 
            name="contact[product]" 
            readonly 
            class="custom-input"
          />
        </div>

        <div class="form-item">
          <el-input 
            v-model="formData.name" 
            name="contact[name]" 
            placeholder="* Name" 
            class="custom-input"
            required
          />
        </div>

        <div class="form-item">
          <el-input 
            v-model="formData.email" 
            name="contact[email]" 
            placeholder="* Email" 
            class="custom-input"
            required
            type="email"
          />
        </div>

        <div class="form-item">
          <el-input 
            v-model="formData.phone" 
            name="contact[phone]" 
            placeholder="Phone" 
            class="custom-input"
          />
        </div>

        <div class="form-item">
          <el-input
            v-model="formData.body"
            name="contact[body]"
            type="textarea"
            :rows="4"
            placeholder="* Message"
            class="custom-input"
            required
          />
        </div>

        <div class="form-footer">
          <button type="submit" class="submit-btn">
            Send
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue';

const props = defineProps({
  productName: {
    type: String,
    default: ''
  }
});

const formData = reactive({
  productName: '',
  name: '',
  email: '',
  phone: '',
  body: ''
});

// 当 props 传入产品名时，自动填入
watch(() => props.productName, (newVal) => {
  formData.productName = newVal;
}, { immediate: true });

</script>

<style scoped>
.inquiry-form-wrapper {
  margin-top: 50px;
  background: #fff;
  border: 1px solid #eee; /* 可选：加个边框 */
}

/* 金色标题栏 */
.form-header {
  background-color: #dcb765; /* 你的主题金色 */
  color: #fff;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 700;
  text-transform: capitalize;
}

.form-body {
  padding: 20px;
}

.form-item {
  margin-bottom: 15px;
}

/* === 深度定制 Element Plus Input 样式 === */
/* 让它看起来像截图里那样简洁 */
:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #e0e0e0 inset; /* 浅灰边框 */
  border-radius: 2px;
  padding: 8px 15px;
}

/* 聚焦时边框变金 */
:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #dcb765 inset;
}

/* 只读输入框背景稍微灰一点 */
:deep(.el-input.is-disabled .el-input__inner), 
:deep(.el-input__inner[readonly]) {
  color: #555;
  background-color: #f9f9f9;
  cursor: not-allowed;
}

/* === 提交按钮 === */
.form-footer {
  margin-top: 10px;
}

.submit-btn {
  width: 100%;
  background-color: #dcb765; /* 金色背景 */
  color: #fff;
  border: none;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  text-transform: capitalize;
}

.submit-btn:hover {
  opacity: 0.9;
}
</style>