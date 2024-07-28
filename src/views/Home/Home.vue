<script setup lang="ts">
import { ElInput } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { ref } from 'vue'

defineOptions({
  name: 'Menu2'
})

const { t } = useI18n()

const text = ref('')
</script>

<template>
  <div><el-empty description="欢迎" /></div>
</template>
