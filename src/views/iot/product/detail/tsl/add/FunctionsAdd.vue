<template>
  <el-drawer
    title="编辑功能定义"
    placement="right"
    :model-value="true"
    :close-on-click-modal="false"
    width="30%"
    class="footer-drawer"
  >
    <el-form :model="formData" ref="form" label-width="auto">
      <el-form-item
        label="功能标识"
        prop="id"
        :rules="[
          { required: true, message: '请输入功能标识' },
          { max: 32, message: '功能标识不超过32个字符' },
          {
            pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'),
            message: '功能标识只能由数字、字母、下划线、中划线组成'
          }
        ]"
      >
        <el-input v-model="formData.id" placeholder="请输入功能标识" :disabled="isEdit" />
      </el-form-item>
      <el-form-item
        label="功能名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入功能名称' },
          { max: 200, message: '功能名称不超过200个字符' }
        ]"
      >
        <el-input v-model="formData.name" placeholder="请输入功能名称" />
      </el-form-item>
      <el-form-item label="是否异步" prop="async" :rules="[{ required: true, message: '请选择' }]">
        <el-radio-group v-model="formData.async">
          <el-radio :value="true">是</el-radio>
          <el-radio :value="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="采集间隔(秒)"
        prop="expands.interval"
        v-if="product.networkType === 'MODBUS'"
      >
        <el-input-number
          v-model="formData.expands.interval"
          :precision="0"
          :min="0"
          :max="65535"
          :step="1"
          controls-position="right"
          placeholder="采集间隔(秒)"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="输入参数">
        <div style="width: 100%">
          <div v-for="item in inputs" class="input-div">
            <div>参数名称：{{ item.name }}</div>
            <div>
              <el-button link type="primary" @click="editInput(item)"> 编辑 </el-button>
              <el-button link type="primary" @click="removeInput(item)"> 删除 </el-button>
            </div>
          </div>
        </div>
        <el-button link type="primary" @click="addInput">
          <Icon icon="carbon:add" />
          添加参数
        </el-button>
      </el-form-item>
      <!-- -->
      <DataTypeItem label="输出参数" :data="formData.output" />
      <!-- -->
      <el-form-item label="描述" prop="description">
        <el-textarea v-model="formData.description" :rows="3" />
      </el-form-item>
    </el-form>
    <div class="drawer-footer">
      <el-button style="margin-right: 8px" @click="$emit('close')">关闭</el-button>
      <el-button type="primary" @click="saveData">保存</el-button>
    </div>
  </el-drawer>
  <Paramter v-if="inputVisible" :data="currentParameter" @close="closeInput" @save="saveInput" />
  <Paramter v-if="outputVisible" :data="currentParameter" @close="closeOutput" @save="saveOutput" />
</template>

<script lang="jsx">
import _ from 'lodash-es'
import DataTypeItem from '../components/DataTypeItem.vue'
import Paramter from '../add/Paramter.vue'

import { getPropertiesData, getFunctionsData } from '../components/data.js'
const defaultFormData = getFunctionsData()
export default {
  name: 'FunctionsAdd',
  components: {
    DataTypeItem,
    Paramter
  },
  props: {
    product: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    this.formData = getFunctionsData(this.data)
    this.inputs = this.formData.inputs
    if (this.data && this.data.id) {
      this.isEdit = true
    }
  },
  data() {
    return {
      formData: _.assign({}, defaultFormData),
      isEdit: false,
      inputs: [],
      inputVisible: false,
      outputVisible: false
    }
  },
  watch: {},
  mounted() {},
  methods: {
    saveData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.formData.output.type !== 'object') {
            delete this.formData.output.properties
          }
          if (this.formData.output.type !== 'array') {
            delete this.formData.output.elementType
          }
          if (!this.formData.output.type) {
            this.formData.output = {}
          }
          this.formData.expands.interval = _.toString(this.formData.expands.interval)
          this.$emit('save', this.formData)
        }
      })
    },
    addInput() {
      this.currentParameter = getPropertiesData()
      this.inputVisible = true
    },
    editInput(item) {
      this.currentParameter = getPropertiesData(item)
      this.inputVisible = true
    },
    removeInput(item) {
      const index = this.inputs.findIndex((i) => i.id === item.id)
      this.inputs.splice(index, 1)
    },
    saveInput(item) {
      const index = this.formData.inputs.findIndex((e) => e.id === item.id)
      if (index === -1) {
        this.formData.inputs.push(item)
      } else {
        this.$set(this.formData.inputs, index, item)
      }
      this.closeInput()
    },
    closeInput() {
      this.inputVisible = false
    },
    saveOutput(item) {
      this.formData.output = item
      this.closeOutput()
    },
    closeOutput() {
      this.outputVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.input-div {
  display: flex;
  border: 1px solid var(--el-border);
}
</style>
