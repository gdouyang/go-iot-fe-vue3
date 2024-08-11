<template>
  <el-upload
    name="file"
    :multiple="false"
    action="api/file/base64"
    :show-file-list="false"
    :with-credentials="true"
    @change="handleChange"
  >
    <BaseButton>
      <template #icon><Icon icon="carbon:cloud-upload" /></template>
      选择文件
    </BaseButton>
  </el-upload>
</template>

<script lang="jsx">
export default {
  name: 'CertificateUpload',
  props: {
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {}
  },
  methods: {
    handleChange(info) {
      if (info.file.status === 'uploading') {
      }
      if (info.file.status === 'done') {
        this.$emit('input', info.file.response.result)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
