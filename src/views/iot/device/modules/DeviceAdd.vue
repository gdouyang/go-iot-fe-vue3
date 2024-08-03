<template>
  <Dialog ref="addModal" @confirm="addConfirm" @close="addClose" :width="500">
    <el-form ref="addFormRef" :model="addObj" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <el-form-item
        label="设备ID"
        prop="id"
        :rules="[
          { required: true, message: '设备ID不能为空', trigger: 'blur' },
          { max: 32, message: '设备ID不超过32个字符' },
          {
            pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'),
            message: '设备ID只能由数字、字母、下划线、中划线组成'
          }
        ]"
      >
        <el-input v-model="addObj.id" :disabled="isEdit" placeholder="请输入设备ID"></el-input>
      </el-form-item>
      <el-form-item
        label="名称"
        prop="name"
        :rules="[{ required: true, message: '名称不能为空', trigger: 'blur' }]"
      >
        <el-input v-model="addObj.name" placeholder="名称" :maxlength="32"></el-input>
      </el-form-item>
      <el-form-item
        label="产品"
        prop="productId"
        :rules="[{ required: true, message: '产品不能为空', trigger: 'blur' }]"
      >
        <el-select
          v-model="addObj.productId"
          @change="productIdChange"
          :disabled="isEdit"
          placeholder="产品"
        >
          <el-option v-for="p in productList" :key="p.id" :value="p.id">{{ p.name }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="设备类型"
        prop="deviceType"
        :rules="[{ required: true, message: '设备类型不能为空', trigger: 'blur' }]"
      >
        <el-select v-model="addObj.deviceType" :disabled="isEdit" @change="deviceTypeChange">
          <el-option value="device">设备</el-option>
          <el-option value="gateway">网关</el-option>
          <el-option value="subdevice">子设备</el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="网关"
        prop="parentId"
        v-if="addObj.deviceType == SUB_DEVICE"
        :rules="[{ required: true, message: '网关不能为空', trigger: 'blur' }]"
      >
        <el-select v-model="addObj.parentId" :disabled="isEdit">
          <el-option v-for="p in gatewayList" :key="p.id" :value="p.id"
            >{{ p.name }}({{ p.id }})</el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item label="说明" prop="desc">
        <el-input
          type="textarea"
          v-model="addObj.desc"
          placeholder="说明"
          :maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import { page, get, getProductList, addDevice, updateDevice } from '@/views/iot/device/api.js'
const defaultAddObj = {
  id: null,
  name: '',
  productId: null,
  productName: null,
  deviceType: 'device',
  parentId: null,
  desc: ''
}
/**
 * 子设备
 */
const SUB_DEVICE = 'subdevice'
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      addObj: _.cloneDeep(defaultAddObj),
      isEdit: false,
      SUB_DEVICE: SUB_DEVICE,
      productList: [],
      gatewayList: []
    }
  },
  created() {},
  methods: {
    add() {
      this.isEdit = false
      this.listAllProduct().then(() => {
        this.$refs.addModal.open({ title: '新增设备' })
      })
    },
    edit(row) {
      this.isEdit = true
      get(row.id).then((data) => {
        if (data.success) {
          const result = data.result
          if (result.deviceType === SUB_DEVICE) {
            this.getGatewayList(result.parentId)
          }
          this.listAllProduct().then(() => {
            this.addObj = result
            this.$refs.addModal.open({ title: '修改设备' })
          })
        }
      })
    },
    addClose() {
      this.addObj = _.cloneDeep(defaultAddObj)
      this.$refs.addFormRef.clearValidate()
    },
    addConfirm() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          let promise = null
          if (this.isEdit) {
            promise = updateDevice(this.addObj)
          } else {
            promise = addDevice(this.addObj)
          }
          promise.then((resp) => {
            if (resp.success) {
              this.$message.success('操作成功')
              this.$refs.addModal.close()
              this.$emit('success')
            } else {
              this.$message.success(resp.message)
            }
          })
        }
      })
    },
    productIdChange(value) {
      const product = _.find(this.productList, (p) => p.id === value)
      if (product) {
        this.addObj.productName = product.name
      }
      this.deviceTypeChange(this.addObj.deviceType)
    },
    deviceTypeChange(value) {
      this.addObj.parentId = null
      if (value === SUB_DEVICE) {
        this.getGatewayList()
      }
    },
    listAllProduct() {
      return getProductList().then((resp) => {
        if (resp.success) {
          this.productList = resp.result
        }
      })
    },
    getGatewayList(deviceId) {
      const condition = [
        { key: 'deviceType', value: 'gateway' },
        { key: 'productId', value: this.addObj.productId }
      ]
      if (deviceId) {
        condition.push({ key: 'id', value: deviceId })
      }
      return page({ pageNum: 1, pageSize: 1000, condition: condition }).then((res) => {
        this.gatewayList = res.result.list
      })
    }
  }
}
</script>
<style lang="less"></style>
