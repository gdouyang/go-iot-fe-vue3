<style lang="less"></style>

<template>
  <Dialog
    ref="addModal"
    @confirm="addConfirm"
    @close="addClose"
    :width="550"
    :showOk="showOk"
    cancelText="关闭"
  >
    <el-alert
      style="margin-bottom: 5px"
      title="导入的物模型会覆盖原来的属性、功能、事件，请谨慎操作！"
      type="warning"
      show-icon
      v-if="showOk"
    >
    </el-alert>
    <AceEditor
      ref="AceEditor"
      v-model:value="tsl"
      lang="json"
      theme="chrome"
      style="width: 480px; height: 450px"
      :options="aceOptions"
      @init="init"
    />
  </Dialog>
</template>

<script lang="jsx">
import { VAceEditor as AceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-chrome'
import _ from 'lodash-es'

export default {
  name: 'TslImportDialog',
  components: {
    AceEditor
  },
  data() {
    return {
      tsl: null,
      aceOptions: {
        enableBasicAutocompletion: true, // 启用基本自动完成功能
        enableLiveAutocompletion: true, // 启用实时自动完成功能 （比如：智能代码提示）
        enableSnippets: true, // 启用代码段
        showLineNumbers: true,
        tabSize: 2,
        wrapEnabled: true,
        showPrintMargin: true,
        readOnly: true
      },
      showOk: false
    }
  },
  created() {},
  methods: {
    open(tsl, isImport) {
      if (isImport) {
        this.showOk = true
        this.$refs.addModal.open({ title: '导入物模型' })
        this.tsl = ''
      } else {
        this.showOk = false
        this.$refs.addModal.open({ title: '查看物模型' })
        this.tsl = tsl ? JSON.stringify(tsl, null, 2) : ''
      }
    },
    init(editor) {
      editor.setOptions({
        readOnly: false
      })
    },
    addConfirm() {
      this.$message.destroy()
      if (!this.tsl) {
        this.$message.error('请填写物模型')
        return
      }
      try {
        const tsl = JSON.parse(this.tsl)
        const text = JSON.stringify(tsl)
        if (!_.isObject(tsl) || !_.startsWith(text, '{') || !_.endsWith(text, '}')) {
          this.$message.error('物模型格式错误，请以“{”开始，以“}”结束')
          return
        }
        this.$emit('import', tsl)
        this.$refs.addModal.close()
      } catch (error) {
        this.$message.error('物模型格式错误，请保证为json字符串')
      }
    },
    addClose() {}
  }
}
</script>
