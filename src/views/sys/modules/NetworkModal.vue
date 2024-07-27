<template>
  <div>
    <Dialog ref="addModal" @confirm="handleOk" @close="handleCancel" :width="500">
      <a-spin :spinning="spinning > 0">
        <a-form-model
          ref="addFormRef"
          :model="addObj"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-form-model-item
            label="端口"
            prop="port"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <a-input-number placeholder="端口" :max-length="20" v-model.number="addObj.port" />
          </a-form-model-item>

          <!-- <a-form-model-item
            label="产品"
            v-if="isEdit"
          >
            <a-input
              :max-length="20"
              :disabled="true"
              v-model="addObj.productId"
            />
          </a-form-model-item>
          <a-form-model-item
            label="类型"
            v-if="isEdit"
          >
            <a-input
              :max-length="20"
              :disabled="true"
              v-model="addObj.type"
            />
          </a-form-model-item> -->
        </a-form-model>
      </a-spin>
    </Dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { getNetwork, editNetwork, addNetwork } from '../networkapi.js'
const defaultAddObj = {
  port: null,
  productId: '',
  configuration: '',
  type: '',
  state: ''
}
export default {
  name: 'NetworkModal',
  components: {},
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
      spinning: 0,
      isEdit: false
    }
  },
  created() {},
  methods: {
    add() {
      this.addObj = _.cloneDeep(defaultAddObj)
      this.isEdit = false
      this.$refs.addModal.open({ title: '新增' })
    },
    edit(record) {
      this.isEdit = true
      this.spinning++
      getNetwork(record.id)
        .then((data1) => {
          if (data1.success) {
            const data = data1.result
            this.$refs.addModal.open({ title: '修改' })
            this.addObj = data
            this.getTreeData()
          }
        })
        .finally(() => {
          this.spinning--
        })
    },
    close() {
      this.$refs.addModal.close()
    },
    handleOk() {
      const _this = this
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const values = _.cloneDeep(this.addObj)
          console.log('form values', values)
          let promise = null
          if (this.isEdit) {
            promise = editNetwork(values)
          } else {
            promise = addNetwork(values)
          }
          promise.then((data) => {
            if (data.success) {
              this.$message.success('操作成功')
              _this.close()
              this.$emit('ok')
            } else {
              this.$message.success(data.message)
            }
          })
        }
      })
    },
    handleCancel() {
      this.$refs.addFormRef.clearValidate()
    }
  }
}
</script>

<style scoped></style>
