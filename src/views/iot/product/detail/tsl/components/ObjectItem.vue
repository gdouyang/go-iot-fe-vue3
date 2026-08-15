<template>
  <div>
    <el-form-item label="JSON对象">
      <el-table v-if="properties.length" :data="properties" row-key="id" size="small" border>
        <el-table-column prop="id" label="标识" min-width="80" />
        <el-table-column prop="name" label="名称" min-width="80" />
        <el-table-column prop="type" label="类型" width="80" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button link type="primary" @click="add">
        <Icon icon="el:CirclePlus" />
        添加参数
      </el-button>
    </el-form-item>
    <Paramter v-if="parameterVisible" :data="currentParameter" @close="close" @save="save" />
  </div>
</template>

<script lang="jsx">
// import _ from 'lodash-es'
import Paramter from '../add/Paramter.vue'
import { getPropertiesData, sameTslId } from './data.js'
export default {
  name: 'ObjectItem',
  components: {
    Paramter
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    if (this.data.properties) {
      this.properties = this.data.properties
    } else {
      this.data.properties = this.properties
    }
  },
  data() {
    return {
      properties: [],
      parameterVisible: false,
      currentParameter: {},
      editingId: null
    }
  },
  mounted() {},
  methods: {
    add() {
      this.editingId = null
      this.currentParameter = getPropertiesData()
      this.parameterVisible = true
    },
    edit(item) {
      this.editingId = item.id
      this.currentParameter = getPropertiesData(item)
      this.parameterVisible = true
    },
    save(item) {
      if (!this.data.properties) {
        this.data.properties = []
      }
      const index = this.data.properties.findIndex((e) => sameTslId(e.id, item.id))
      if (index === -1) {
        this.data.properties.push(item)
      } else if (this.editingId != null && sameTslId(this.editingId, item.id)) {
        this.data.properties.splice(index, 1, item)
      } else {
        this.$message.error('参数标识已存在（不区分大小写），请修改')
        return
      }
      this.close()
    },
    close() {
      this.parameterVisible = false
      this.editingId = null
    },
    remove(item) {
      const index = this.properties.findIndex((i) => sameTslId(i.id, item.id))
      this.properties.splice(index, 1)
      this.properties = this.properties
    }
  }
}
</script>
