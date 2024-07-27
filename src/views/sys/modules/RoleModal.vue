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
            label="角色名称"
            prop="name"
            :rules="[{ required: true, message: '请输入名称' }]"
          >
            <a-input placeholder="角色名称" :max-length="20" v-model="addObj.name" />
          </a-form-model-item>

          <a-form-model-item label="描述">
            <a-textarea :rows="5" placeholder="..." v-model="addObj.desc" :max-length="200" />
          </a-form-model-item>

          <a-divider>拥有权限</a-divider>
          <tree :nodes="treeData" :setting="setting" @onCreated="onCreated"></tree>
        </a-form-model>
      </a-spin>
    </Dialog>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash-es'
import { getRole, editRole, addRole, getRoleRelMenus, getMenus } from '../api.js'
const defaultAddObj = {
  name: '',
  desc: ''
}
export default {
  name: 'RoleModal',
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
      addObj: cloneDeep(defaultAddObj),
      spinning: 0,

      setting: {
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: 0
          }
        },
        check: {
          enable: true
        }
      },
      treeData: []
    }
  },
  created() {},
  methods: {
    add() {
      this.addObj = cloneDeep(defaultAddObj)
      this.isEdit = false
      this.getTreeData()
      this.$refs.addModal.open({ title: '新增' })
    },
    edit(record) {
      this.isEdit = true
      this.spinning++
      getRole(record.id)
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
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const values = cloneDeep(this.addObj)
          console.log('form values', values)
          values.ruleRefMenus = this.getCheckPermissions()
          let promise = null
          if (this.isEdit) {
            promise = editRole(values)
          } else {
            promise = addRole(values)
          }
          promise.then((data) => {
            if (data.success) {
              this.$message.success('操作成功')
              this.close()
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
    },
    onCreated(ztree) {
      this.treeObj = ztree
    },
    getTreeData() {
      if (this.isEdit) {
        this.spinning++
        getRoleRelMenus(this.addObj.id)
          .then((data) => {
            if (data.success) {
              this.getAllMenu(data.result)
            }
          })
          .finally(() => {
            this.spinning--
          })
      } else {
        this.getAllMenu([])
      }
    },
    getAllMenu(checkeds) {
      this.spinning++
      getMenus()
        .then((data) => {
          const datas = data.result
          const list = []
          let id = 1
          _.forEach(datas, (item) => {
            item.pid = 0
            item.id = id
            const checkItem = _.find(checkeds, (check) => check.code === item.permissionId)
            list.push({
              id: id,
              pid: 0,
              name: item.permissionName,
              code: item.permissionId,
              checked: !_.isNil(checkItem)
            })
            _.forEach(item.actionEntitySet, (ac) => {
              id++
              const actions = _.get(checkItem, 'action')
              list.push({
                id: id,
                pid: item.id,
                name: ac.describe,
                code: ac.action,
                checked: !_.isNil(_.find(actions, (checkAc) => checkAc.id === ac.action))
              })
            })
            id++
          })
          console.log(list)

          this.treeData = list
        })
        .finally(() => {
          this.spinning--
        })
    },
    getCheckPermissions() {
      var treeObj = this.treeObj
      var checkedNodes = treeObj.getCheckedNodes(true)
      const datas = []
      _.forEach(checkedNodes, (node) => {
        if (node.pid === 0) {
          const action = _.map(
            _.filter(checkedNodes, (n) => n.pid === node.id),
            (ac) => {
              return { id: ac.code, name: ac.name }
            }
          )
          datas.push({
            code: node.code,
            action: action
          })
        }
      })
      return datas
    }
  }
}
</script>

<style scoped></style>
