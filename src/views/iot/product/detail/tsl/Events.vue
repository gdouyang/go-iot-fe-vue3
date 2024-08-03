<template>
  <div>
    <el-card title="事件定义" :style="{ marginBottom: '20px' }">
      <el-button type="primary" slot="extra" @click="add">添加</el-button>
      <a-table rowKey="id" :columns="columns" :dataSource="data">
        <span slot="level" slot-scope="text">{{ gradeText[text] }}</span>
        <span slot="action" slot-scope="text, record">
          <a @click="edit(record)">修改</a>
          <el-divider direction="vertical" />
          <el-popconfirm title="确认删除？" @confirm="remove(record)">
            <a>删除</a>
          </el-popconfirm>
        </span>
      </a-table>
    </el-card>
    <EventsAdd v-if="visible" :data="current" @save="saveData" @close="close" />
  </div>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import EventsAdd from './add/EventsAdd.vue'
export default {
  name: 'Events',
  components: {
    EventsAdd
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        { label: '事件标识', field: 'id' },
        { label: '名称', field: 'name' },
        // { label: '事件级别', field: 'expands.level', scopedSlots: { customRender: 'level' } },
        { label: '说明', field: 'description', width: '30%', ellipsis: true },
        { label: '操作', scopedSlots: { customRender: 'action' } }
      ],
      gradeText: {
        ordinary: '普通',
        warn: '警告',
        urgent: '紧急'
      },
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
    saveData(item, onlySave) {
      const data = this.data
      const i = data.findIndex((j) => j.id === item.id)
      if (i > -1) {
        if (!this.isEdit) {
          this.$message.error('事件标识已存在，请修改')
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
