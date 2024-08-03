<template>
  <el-drawer
    title="编辑属性"
    placement="right"
    :closable="false"
    visible
    width="30%"
    class="footer-drawer"
  >
    <el-form :model="formData" ref="form">
      <el-form-item
        label="属性标识"
        prop="id"
        :rules="[
          { required: true, message: '请输入属性标识' },
          { max: 32, message: '属性标识不超过32个字符' },
          {
            pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'),
            message: '属性标识只能由数字、字母、下划线、中划线组成'
          }
        ]"
      >
        <el-input v-model="formData.id" placeholder="请输入属性标识" :disabled="isEdit" />
      </el-form-item>
      <el-form-item
        label="属性名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入属性名称' },
          { max: 200, message: '属性名称不超过200个字符' }
        ]"
      >
        <el-input v-model="formData.name" placeholder="请输入属性名称" />
      </el-form-item>
      <!-- -->
      <DataTypeItem
        label="数据类型"
        :data.sync="formData"
        :rules="[{ required: true, message: '请选择' }]"
      />
      <!-- -->
      <!-- <el-form-item
        label="是否只读"
        prop="expands.readOnly"
        :rules="[ { required: true, message: '请选择' } ]"
      >
        <a-radio-group v-model="formData.expands.readOnly">
          <a-radio value="true">是</a-radio>
          <a-radio value="false">否</a-radio>
        </a-radio-group>
      </el-form-item> -->
      <el-form-item label="描述" prop="description">
        <el-textarea v-model="formData.description" :rows="3" />
      </el-form-item>
    </el-form>
    <div class="drawer-footer">
      <el-button style="margin-right: 8px" @click="$emit('close')">关闭</el-button>
      <el-button type="primary" @click="saveData">保存</el-button>
    </div>
  </el-drawer>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import DataTypeItem from '../components/DataTypeItem.vue'

import { getPropertiesData } from '../components/data.js'
const defaultFormData = getPropertiesData()
export default {
  name: 'PropertiesAdd',
  components: {
    DataTypeItem
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
    this.formData = _.cloneDeep(_.assign({}, defaultFormData, this.data))
    if (this.data && this.data.id) {
      this.isEdit = true
    }
  },
  data() {
    return {
      formData: _.cloneDeep(defaultFormData),
      isEdit: false
    }
  },
  watch: {},
  mounted() {},
  methods: {
    saveData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('save', this.formData)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
