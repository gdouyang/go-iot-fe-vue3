<template>
  <div>
    <el-modal
      :title="title"
      :width="500"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <el-spin :spinning="spinning > 0">
        <el-form-model
          ref="addFormRef"
          :model="addObj"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <el-form-model-item
            label="账号"
            prop="username"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="addObj.username" :max-length="32" />
          </el-form-model-item>
          <el-form-model-item
            label="名称"
            prop="nickname"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="addObj.nickname" :max-length="32" />
          </el-form-model-item>

          <el-form-model-item
            label="状态"
            prop="enableFlag"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <el-select v-model="addObj.enableFlag">
              <el-select-option value="true"> 启动 </el-select-option>
              <el-select-option value="false"> 禁用 </el-select-option>
            </el-select>
          </el-form-model-item>

          <el-form-model-item
            label="密码"
            prop="password"
            :rules="[
              { required: true, message: '请输入' },
              { min: 6, message: '密码不小于6位' }
            ]"
            v-if="!isEdit"
          >
            <el-input v-model="addObj.password" type="password" :max-length="20" />
          </el-form-model-item>

          <el-form-model-item
            label="确认密码"
            prop="password2"
            :rules="[
              { required: true, message: '请输入' },
              { validator: validatePassCheck, trigger: 'blur' }
            ]"
            v-if="!isEdit"
          >
            <el-input v-model="addObj.password2" type="password" :max-length="20" />
          </el-form-model-item>

          <el-form-model-item
            label="角色"
            prop="roleId"
            :rules="[{ required: true, message: '请选择角色' }]"
          >
            <el-select v-model="addObj.roleId">
              <el-select-option v-for="item in roleList" :value="item.id" :key="item.id">
                {{ item.name }}
              </el-select-option>
            </el-select>
          </el-form-model-item>

          <el-form-model-item label="描述">
            <el-textarea :rows="5" placeholder="..." v-model="addObj.desc" :max-length="200" />
          </el-form-model-item>
        </el-form-model>
      </el-spin>
    </el-modal>
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
