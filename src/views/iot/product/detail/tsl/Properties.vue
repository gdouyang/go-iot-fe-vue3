<template>
  <div>
    <el-card title="属性定义" :style="{ marginBottom: '20px' }">
      <el-button type="primary" slot="extra" @click="add">添加</el-button>
      <a-table rowKey="id" :columns="columns" :dataSource="data">
        <span slot="type" slot-scope="text">{{ text }}</span>
        <span slot="readOnly" slot-scope="text">{{
          text === 'true' || text === true ? '是' : '否'
        }}</span>
        <span slot="action" slot-scope="text, record">
          <a @click="edit(record)">修改</a>
          <el-divider direction="vertical" />
          <el-popconfirm title="确认删除？" @confirm="remove(record)">
            <a>删除</a>
          </el-popconfirm>
        </span>
      </a-table>
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
      columns: [
        { label: '属性标识', field: 'id' },
        { label: '属性名称', field: 'name' },
        { label: '数据类型', field: 'type', scopedSlots: { customRender: 'type' } },
        // { label: '是否只读', field: 'expands.readOnly', scopedSlots: { customRender: 'readOnly' } },
        { label: '说明', field: 'description', width: '30%', ellipsis: true },
        { label: '操作', scopedSlots: { customRender: 'action' } }
      ],
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
        // data[i] = item;
        this.$set(data, i, item)
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
