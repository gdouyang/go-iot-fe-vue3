<template>
  <div>
    <Dialog
      ref="addModal"
      v-model="showModal"
      @confirm="handleOk"
      @close="handleCancel"
      :width="500"
    >
      <ElForm ref="addFormRef" :model="addObj" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <ElFormItem
          label="角色名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称' }]"
        >
          <ElInput placeholder="角色名称" :max-length="20" v-model="addObj.name" />
        </ElFormItem>

        <el-form-item label="描述">
          <el-textarea :rows="5" placeholder="..." v-model="addObj.desc" :max-length="200" />
        </el-form-item>

        <el-divider>拥有权限</el-divider>
        <tree :nodes="treeData" :setting="setting" @onCreated="onCreated"></tree>
      </ElForm>
    </Dialog>
  </div>
</template>

<script>
import { cloneDeep, forEach, find, map, isNil, get } from 'lodash-es'
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
      treeData: [],
      showModal: false
    }
  },
  created() {},
  methods: {
    add() {
      this.addObj = cloneDeep(defaultAddObj)
      this.isEdit = false
      this.getTreeData()
      this.showModal = true
      // this.$refs.addModal.open({ title: '新增' })
    },
    edit(record) {
      this.isEdit = true
      this.spinning++
      getRole(record.id)
        .then((data1) => {
          if (data1.success) {
            const data = data1.result
            this.showModal = true
            // this.$refs.addModal.open({ title: '修改' })
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
          forEach(datas, (item) => {
            item.pid = 0
            item.id = id
            const checkItem = find(checkeds, (check) => check.code === item.permissionId)
            list.push({
              id: id,
              pid: 0,
              name: item.permissionName,
              code: item.permissionId,
              checked: !isNil(checkItem)
            })
            forEach(item.actionEntitySet, (ac) => {
              id++
              const actions = get(checkItem, 'action')
              list.push({
                id: id,
                pid: item.id,
                name: ac.describe,
                code: ac.action,
                checked: !isNil(find(actions, (checkAc) => checkAc.id === ac.action))
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
      forEach(checkedNodes, (node) => {
        if (node.pid === 0) {
          const action = map(
            filter(checkedNodes, (n) => n.pid === node.id),
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
