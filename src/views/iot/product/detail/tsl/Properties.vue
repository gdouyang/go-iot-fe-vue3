<template>
  <div>
    <el-card title="属性定义" shadow="never">
      <el-button type="primary" slot="extra" @click="add">添加</el-button>
      <el-table rowKey="id" :data="data">
        <el-table-column prop="id" label="属性标识" />
        <el-table-column prop="name" label="属性名称" />
        <el-table-column prop="type" label="数据类型" />
        <el-table-column prop="description" label="说明" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="edit(scope.row)">修改</el-button>
            <el-divider direction="vertical" />
            <el-popconfirm title="确认删除？" @confirm="remove(scope.row)">
              <template #reference>
                <el-button link type="primary">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <PropertiesAdd
      v-if="visible"
      :product="product"
      :data="current"
      @save="savePropertiesData"
      @close="close"
    />
  </div>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import PropertiesAdd from './add/PropertiesAdd.vue'
export default {
  name: 'Properties',
  components: {
    PropertiesAdd
  },
  props: {
    product: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      current: {},
      isEdit: false
    }
  },
  mounted() {},
  methods: {
    add() {
      this.isEdit = false
      this.current = {}
      this.visible = true
    },
    edit(item) {
      this.isEdit = true
      this.current = _.cloneDeep(item)
      this.visible = true
    },
    remove(item) {
      const temp = this.data.filter((e) => e.id !== item.id)
      this.$emit('save', temp)
    },
    savePropertiesData(item, onlySave) {
      const data = this.data
      const i = data.findIndex((j) => j.id === item.id)
      if (i > -1) {
        if (!this.isEdit) {
          this.$message.error('属性标识已存在，请修改')
          return
        }
        data[i] = item
      } else {
        data.push(item)
      }
      this.$emit('save', data, onlySave)
      this.close()
    },
    close() {
      this.current = {}
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped></style>
