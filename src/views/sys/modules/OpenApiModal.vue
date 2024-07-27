<template>
  <div>
    <Dialog ref="addModal" @confirm="addConfirm" @close="addClose" :width="500">
      <a-form-model ref="addFormRef" :model="addObj" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-model-item
          label="clientId"
          prop="username"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <a-input v-model="addObj.username" :max-length="32" :disabled="true" />
        </a-form-model-item>
        <a-form-model-item
          label="secureKey"
          prop="password"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <a-input v-model="addObj.password" :max-length="32" />
        </a-form-model-item>
        <a-form-model-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <a-input placeholder="名称" v-model="addObj.name" :max-length="32" />
        </a-form-model-item>

        <a-form-model-item
          label="状态"
          prop="enableFlag"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <dict-select category="ENABLE_STATUS" valueType="number" v-model="addObj.enableFlag" />
        </a-form-model-item>

        <a-form-model-item
          label="角色"
          prop="roleId"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <a-select v-model="addObj.roleId">
            <a-select-option v-for="item in roleList" :value="item.id" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="描述">
          <a-textarea
            :rows="5"
            placeholder="..."
            id="desc"
            v-model="addObj.desc"
            :max-length="200"
          />
        </a-form-model-item>
      </a-form-model>
    </Dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { getAllRole } from '../api.js'
const defaultAddObj = {
  username: '',
  name: '',
  password: '',
  sex: 2,
  enableFlag: null,
  desc: '',
  roleId: null,
  tenantId: null
}
// 生成随机数
export const randomString = (length) => {
  const tempLength = length || 32
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < tempLength; i += 1) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export default {
  name: 'OpenApiModal',
  props: {
    showTanent: {
      type: Boolean,
      default: false
    }
  },
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
      isEdit: false,
      roleList: []
    }
  },
  created() {},
  methods: {
    add() {
      this.addObj = _.cloneDeep(defaultAddObj)
      this.addObj.username = randomString(16)
      this.addObj.password = randomString(24)
      this.isEdit = false
      this.getAllRole()
      this.$refs.addModal.open({ title: '新增' })
    },
    edit(record) {
      this.isEdit = true
      this.$http
        .get(`open-api/${record.id}`)
        .then((data1) => {
          if (data1.success) {
            const data = data1.result
            this.addObj = data
            this.getAllRole()
            this.$refs.addModal.open({ title: '修改' })
          }
        })
        .finally(() => {})
    },
    addClose() {
      this.$emit('close')
      this.$refs.addFormRef.clearValidate()
    },
    addConfirm() {
      // 触发表单验证
      this.$refs.addFormRef.validate((valid) => {
        // 验证表单没错误
        if (valid) {
          const values = _.cloneDeep(this.addObj)
          console.log('form values', values)
          values.isTenant = this.showTanent
          let promise = null
          if (this.isEdit) {
            promise = this.$http.put('open-api', values)
          } else {
            promise = this.$http.post('open-api', values)
          }
          promise.then((data) => {
            if (data.success) {
              this.$message.success('操作成功')
              this.$refs.addModal.close()
              this.$emit('ok')
            } else {
              this.$message.success(data.message)
            }
          })
        }
      })
    },
    getAllRole() {
      getAllRole().then((resp) => {
        this.roleList = resp.result.list
      })
    }
  }
}
</script>

<style scoped></style>
