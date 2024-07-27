<template>
  <div>
    <a-modal
      :title="title"
      :width="500"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="spinning > 0">
        <a-form-model
          ref="addFormRef"
          :model="addObj"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-form-model-item
            label="账号"
            prop="username"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <a-input v-model="addObj.username" :max-length="32" />
          </a-form-model-item>
          <a-form-model-item
            label="名称"
            prop="nickname"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <a-input v-model="addObj.nickname" :max-length="32" />
          </a-form-model-item>

          <a-form-model-item
            label="状态"
            prop="enableFlag"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <a-select v-model="addObj.enableFlag">
              <a-select-option value="true"> 启动 </a-select-option>
              <a-select-option value="false"> 禁用 </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            label="密码"
            prop="password"
            :rules="[
              { required: true, message: '请输入' },
              { min: 6, message: '密码不小于6位' }
            ]"
            v-if="!isEdit"
          >
            <a-input v-model="addObj.password" type="password" :max-length="20" />
          </a-form-model-item>

          <a-form-model-item
            label="确认密码"
            prop="password2"
            :rules="[
              { required: true, message: '请输入' },
              { validator: validatePassCheck, trigger: 'blur' }
            ]"
            v-if="!isEdit"
          >
            <a-input v-model="addObj.password2" type="password" :max-length="20" />
          </a-form-model-item>

          <a-form-model-item
            label="角色"
            prop="roleId"
            :rules="[{ required: true, message: '请选择角色' }]"
          >
            <a-select v-model="addObj.roleId">
              <a-select-option v-for="item in roleList" :value="item.id" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="描述">
            <a-textarea :rows="5" placeholder="..." v-model="addObj.desc" :max-length="200" />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { editUser, addUser, getAllRole, getUser } from '../api.js'
import _ from 'lodash'
const defaultAddObj = {
  username: '',
  nickname: '',
  enableFlag: 'true',
  password: '',
  password2: '',
  roleId: null,
  desc: ''
}
export default {
  name: 'UserModal',
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
      visible: false,
      confirmLoading: false,
      addObj: _.cloneDeep(defaultAddObj),
      title: '',
      spinning: 0,

      isEdit: false,
      roleList: []
    }
  },
  created() {},
  methods: {
    validatePassCheck(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addObj.password) {
        callback(new Error('两次密码不一致!'))
      } else {
        callback()
      }
    },
    add() {
      this.title = '新增'
      this.addObj = _.cloneDeep(defaultAddObj)
      this.isEdit = false
      this.visible = true
      this.getAllRole()
    },
    edit(record) {
      this.isEdit = true
      this.spinning++
      getUser(record.id)
        .then((data1) => {
          if (data1.success) {
            const data = data1.result
            data.enableFlag = data.enableFlag + ''
            this.addObj = Object.assign({}, data)
            this.title = '修改'
            this.visible = true
            this.getAllRole()
          }
        })
        .finally(() => {
          this.spinning--
        })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      // 触发表单验证
      this.$refs.addFormRef.validate((valid) => {
        // 验证表单没错误
        if (valid) {
          const values = _.cloneDeep(this.addObj)
          console.log('form values', values)
          values.enableFlag = values.enableFlag === 'true'
          this.confirmLoading = true
          let promise = null
          if (this.isEdit) {
            promise = editUser(values)
          } else {
            promise = addUser(values)
          }
          promise
            .then((data) => {
              if (data.success) {
                this.$message.success('操作成功')
                this.close()
                this.$emit('ok')
              } else {
                this.$message.success(data.message)
              }
            })
            .finally(() => {
              this.confirmLoading = false
            })
        }
      })
    },
    handleCancel() {
      this.close()
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
