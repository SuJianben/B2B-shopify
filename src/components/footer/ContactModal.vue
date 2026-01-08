<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    :width="isMobile ? '90%' : '500px'" 
    class="custom-contact-modal"
    :show-close="false"
    :close-on-click-modal="false"
    append-to-body
    align-center
  >
    <div class="custom-close-btn" @click="$emit('update:visible', false)">
      <el-icon><CloseBold /></el-icon>
    </div>

    <div class="modal-content-wrapper">
      
      <div class="modal-header-strip">
        Leave Your Message
      </div>

      <el-form 
        ref="formRef" 
        :model="formData" 
        :rules="rules" 
        class="custom-form"
        size="large"
      >
        <el-form-item prop="name" class="styled-form-item">
          <el-input v-model="formData.name" placeholder="* Name" />
        </el-form-item>

        <el-form-item prop="email" class="styled-form-item">
          <el-input v-model="formData.email" placeholder="* Email" />
        </el-form-item>

        <el-form-item prop="phone" class="styled-form-item">
          <el-input v-model="formData.phone" placeholder="Phone" />
        </el-form-item>

        <el-form-item prop="message" class="styled-form-item">
          <el-input 
            v-model="formData.message" 
            type="textarea" 
            :rows="isMobile ? 4 : 5" 
            placeholder="* Message"
            resize="none" 
          />
        </el-form-item>

        <el-form-item style="margin-bottom: 0;">
          <el-button type="primary" class="submit-btn" :loading="loading" @click="submitToShopify">
            Send
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { CloseBold } from '@element-plus/icons-vue'

defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible'])

const loading = ref(false)
const formRef = ref(null)
const formData = reactive({ name: '', email: '', phone: '', message: '', city: '' , country: ''})

// 2. ⭐ 新增：自动获取 IP 位置的函数
const fetchLocation = async () => {
  try {
    // 使用免费的 ipapi 接口
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    if (data.city && data.country_name) {
      formData.city = data.city
      formData.country = data.country_name
      console.log('Auto-detected location:', formData.city, formData.country)
    }
  } catch (e) {
    console.warn('Location detection failed, using default.')
  }
}

// === 1. 响应式判断逻辑 ===
const windowWidth = ref(window.innerWidth)
const updateWidth = () => windowWidth.value = window.innerWidth
const isMobile = computed(() => windowWidth.value <= 768)

// 组件挂载时获取位置
onMounted(() => {
  fetchLocation()
})
onMounted(() => window.addEventListener('resize', updateWidth))
onUnmounted(() => window.removeEventListener('resize', updateWidth))

// 校验规则
const rules = {
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' }, 
    { type: 'email', message: 'Invalid email format', trigger: 'blur' }
  ],
  message: [{ required: true, message: 'Message is required', trigger: 'blur' }]
}

const submitToShopify = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 1. 你的 Google Apps Script URL (刚才复制的)
        const GAS_URL = 'https://script.google.com/macros/s/AKfycbwbku6KZFsfYZwVXe8xfR1vp_17MbSiVRYm6h6zz2oGQUNju3lHoH3RnkJFDNjMtcEx/exec'

        // 2. 准备数据 (JSON 对象)
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          city: formData.city,
          country: formData.country
        }

        // 3. 发送请求
        // ⭐ 技巧：这里不加 headers: {'Content-Type': 'application/json'}
        // 而是利用 fetch 默认行为发送 text/plain，这能避开复杂的 CORS 预检
        const response = await fetch(GAS_URL, {
          method: 'POST',
          body: JSON.stringify(payload)
        })

        // GAS 成功通常返回 200，内容是 JSON
        const result = await response.json()

        if (result.result === 'success') {
          ElMessage.success('Message sent successfully!')
          emit('update:visible', false)
          formRef.value.resetFields()
        } else {
          throw new Error('Script returned error')
        }

      } catch (error) {
        console.error('GAS Error:', error)
        // GAS 有时因为重定向问题，fetch 可能会抛出异常但实际数据已写入
        // 如果你发现数据进表格了但前端报错，可以把这里改宽容一点
        ElMessage.error('Failed to send. Please try again.')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.modal-content-wrapper {
  padding: 0 10px 10px; 
}

.modal-header-strip {
  background-color: #d4af37;
  color: #fff;
  font-size: 18px;
  padding: 15px 20px;
  margin-bottom: 25px;
  font-weight: 500;
  border-radius: 2px;
}

.styled-form-item { margin-bottom: 20px; }

/* 左侧金边样式 */
:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  padding-left: 15px;
  border-radius: 2px;
  border-left: 3px solid #d4af37 !important; 
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #d4af37 inset !important;
}

:deep(input::placeholder),
:deep(textarea::placeholder) {
  color: #999;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  background-color: #d4af37;
  border-color: #d4af37;
  height: 42px;
  font-size: 16px;
  border-radius: 2px;
  transition: opacity 0.3s;
}
.submit-btn:hover {
  background-color: #d4af37;
  border-color: #d4af37;
  opacity: 0.9;
}

/* === 关闭按钮 (PC默认) === */
.custom-close-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 30px;
  height: 30px;
  background-color: #000;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  border: 2px solid #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}
.custom-close-btn:hover { transform: scale(1.1); }

/* === 2. 手机端样式优化 === */
@media (max-width: 768px) {
  .modal-header-strip {
    font-size: 16px;       /* 标题字号调小 */
    padding: 12px 15px;    /* 标题内边距减小 */
    margin-bottom: 20px;
  }
  
  .modal-content-wrapper {
    padding: 0;            /* 移除内容区多余内边距 */
  }

  /* 调整关闭按钮：缩小并防止贴边太近 */
  .custom-close-btn {
    width: 26px;
    height: 26px;
    top: -12px;   /* 稍微往回收一点 */
    right: -10px; /* 稍微往回收一点，防止被屏幕切掉 */
    font-size: 14px;
    border-width: 1.5px;
  }
}
</style>

<style>
/* 全局覆盖样式 */
.custom-contact-modal .el-dialog {
  border-radius: 4px;
  padding: 20px;
  overflow: visible; /* 允许按钮悬浮 */
  box-shadow: 0 15px 30px rgba(0,0,0,0.2) !important;
  max-width: 95vw; /* 防止手机上太宽撑爆屏幕 */
}

/* 手机端覆盖：减少弹窗留白，让内容显示更多 */
@media (max-width: 768px) {
  .custom-contact-modal .el-dialog {
    padding: 15px !important; /* 手机上白边留少一点 */
    margin-top: 15vh !important; /* 调整垂直位置 */
  }
}

.custom-contact-modal .el-dialog__header { display: none; }
.custom-contact-modal .el-dialog__body { padding: 0 !important; }
</style>