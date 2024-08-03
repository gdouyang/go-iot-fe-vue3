<template>
  <div>
    <el-card size="small" :bordered="false" style="background-color: #eee">
      <el-row>
        <span style="margin-right: 10px">执行动作{{ position + 1 }}</span>
        <el-popconfirm
          :title="`确认删除此执行动作${position + 1}？`"
          @confirm="$emit('remove', position)"
        >
          <a>删除</a>
        </el-popconfirm>
      </el-row>

      <el-row :gutter="16" :key="position + 1">
        <el-col :span="6">
          <el-select
            placeholder="选择动作类型"
            v-model="action.executor"
            key="trigger"
            @change="executorChange"
            :class="{ 'v-error': hasError }"
          >
            <el-option value="notifier">消息通知</el-option>
            <el-option value="device-message-sender">设备输出</el-option>
          </el-select>
        </el-col>
        <div v-if="action.executor === 'notifier'">
          <NotifierAction :actionData="action" />
        </div>
        <div v-else-if="action.executor === 'device-message-sender'">
          <DeviceAction :actionData="action" />
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import { newNotifierAction, newDeviceMessageAction } from './data.js'
import NotifierAction from './NotifierAction.vue'
import DeviceAction from './DeviceAction.vue'
export default {
  name: 'Actions',
  props: {
    action: {
      type: Object,
      default: null
    },
    position: {
      type: Number,
      default: null
    }
  },
  inject: ['formChecker'],
  components: {
    NotifierAction,
    DeviceAction
  },
  data() {
    return {
      hasError: false
    }
  },
  created() {
    const checkerId = (this.checkerId = 'action' + _.uniqueId())
    this.formChecker.set(checkerId, () => {
      this.hasError = false
      if (!this.action.executor) {
        this.hasError = true
        return false
      }
      return true
    })
  },
  beforeDestroy() {
    this.formChecker.delete(this.checkerId)
  },
  methods: {
    executorChange(value) {
      if (value === 'notifier') {
        this.action.configuration = newNotifierAction().configuration
      } else if (value === 'device-message-sender') {
        this.action.configuration = newDeviceMessageAction().configuration
      }
      // this.action.executor = value
      this.$emit('save', this.position, this.action)
    }
  }
}
</script>
