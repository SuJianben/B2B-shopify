<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="Leave Your Message"
    width="600px"
    class="contact-modal"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="custom-form">
      <el-form-item label="* Name" prop="name">
        <el-input v-model="formData.name" placeholder="Name" />
      </el-form-item>
      <el-form-item label="* Email" prop="email">
        <el-input v-model="formData.email" placeholder="Email" />
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input v-model="formData.phone" placeholder="Phone" />
      </el-form-item>
      <el-form-item label="* Message" prop="message">
        <el-input v-model="formData.message" type="textarea" :rows="4" placeholder="Message" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="submit-btn" :loading="loading" @click="submitToShopify">Send</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible'])

const loading = ref(false)
const formRef = ref(null)
const formData = reactive({ name: '', email: '', phone: '', message: '' })

const rules = {
  name: [{ required: true, message: 'Please input name', trigger: 'blur' }],
  email: [{ required: true, message: 'Please input email', trigger: 'blur' }, { type: 'email', message: 'Invalid email', trigger: 'blur' }],
  message: [{ required: true, message: 'Please input message', trigger: 'blur' }]
}

const submitToShopify = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const shopifyData = new FormData()
        shopifyData.append('form_type', 'contact')
        shopifyData.append('utf8', '✓')
        shopifyData.append('contact[email]', formData.email)
        shopifyData.append('contact[body]', `Name: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`)
        
        console.log('Mock sending to Shopify...', Object.fromEntries(shopifyData))
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟延迟

        ElMessage.success('Message sent successfully!')
        emit('update:visible', false) // 关闭弹窗
        formRef.value.resetFields()
      } catch (error) {
        ElMessage.error('Failed to send.')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
/* 全局覆盖 Dialog 样式 (金色头部) */
:global(.contact-modal .el-dialog__header) { background-color: #d4af37; margin-right: 0; padding: 20px; }
:global(.contact-modal .el-dialog__title) { color: #fff; font-weight: 600; }
:global(.contact-modal .el-dialog__close) { color: #fff !important; }
.submit-btn { width: 100%; background-color: #d4af37; border-color: #d4af37; height: 45px; }
.submit-btn:hover { background-color: #c19b2e; border-color: #c19b2e; }
</style>