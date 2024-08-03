<template>
  <div>
    <el-col :span="4">
      <el-input placeholder="点击选择设备" v-model="deviceData.name" :disabled="true">
        <a-icon slot="addonAfter" type="api" @click="selectDevice" title="点击选择设备"></a-icon>
      </el-input>
    </el-col>
    <el-col :span="4" v-if="deviceData.name">
      <el-select
        placeholder="选择类型，如：属性/功能"
        :defaultValue="messageTypeDefaultValue"
        @change="messageTypeChange"
      >
        <!-- <el-option value="WRITE_PROPERTY">设置属性</el-option> -->
        <el-option value="INVOKE_FUNCTION">调用功能</el-option>
      </el-select>
    </el-col>
    <!-- <div v-show="messageType === 'WRITE_PROPERTY'">
      <el-col :span="4">
        <el-select
          placeholder="物模型属性"
          :value="propertiesDefaultValue"
          @change="propertiesDataChange"
        >
          <el-option v-for="item in properties" :key="item.id" :value="item.id">{{ item.name }}({{ item.id }})</el-option>
        </el-select>
      </el-col>
      <Properties :propertiesData="propertiesData" :actionData="actionData" :arrayData.sync="arrayData" />
    </div> -->
    <div v-show="messageType === 'INVOKE_FUNCTION'">
      <el-col :span="4">
        <el-select
          placeholder="物模型功能"
          :value="functionDefaultValue"
          @change="functionIdChange"
        >
          <el-option template v-for="item in functions" :key="item.id" :value="item.id"
            >{{ item.name }}({{ item.id }})</el-option
          >
        </el-select>
      </el-col>
      <el-col
        :span="24"
        v-for="(item, index) in functionData.inputs"
        :key="`function_${item.id}_${index}`"
      >
        <div>
          <el-col :span="4">
            <el-input :value="`${item.name}(${item.id})`" :readOnly="true" />
          </el-col>
          <DeviceFunction :item="item" :index="index" :actionData="actionData" />
        </div>
      </el-col>
    </div>

    <DeviceSelect @select="select" ref="DeviceSelect" />
  </div>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import { WRITE_PROPERTY, INVOKE_FUNCTION } from './data.js'
import Properties from './DeviceProperties.vue'
import DeviceFunction from './DeviceFunction.vue'
import DeviceSelect from '@/views/iot/device/DeviceSelect.vue'
import { get as getDevice } from '@/views/iot/device/api.js'
export default {
  name: 'DeviceAction',
  props: {
    actionData: {
      type: Object,
      default: null
    }
  },
  components: {
    Properties,
    DeviceFunction,
    DeviceSelect
  },
  computed: {
    messageTypeDefaultValue() {
      const message = this.actionData.configuration
      return (message && message.messageType) || undefined
    },
    propertiesDefaultValue() {
      return this.propertiesData.id || undefined
    },
    functionDefaultValue() {
      const message = this.actionData.configuration
      return (message && message.functionId) || undefined
    }
  },
  created() {
    const deviceId = this.actionData.configuration.deviceId
    if (deviceId) {
      this.findDevice(deviceId)
    }
  },
  data() {
    return {
      messageType: null,
      deviceData: {
        name: null,
        metadata: {
          properties: [],
          functions: []
        }
      },
      propertiesData: {},
      arrayData: [],
      functionData: {},
      properties: [],
      functions: []
    }
  },
  methods: {
    messageTypeChange(value) {
      this.messageType = value
      if (value === 'WRITE_PROPERTY') {
        this.actionData.configuration = WRITE_PROPERTY()
      } else if (value === 'INVOKE_FUNCTION') {
        this.actionData.configuration = INVOKE_FUNCTION()
      }
      this.propertiesData = {}
      this.functionData = {}
      this.actionData.configuration.messageType = value
    },
    selectDevice() {
      this.$refs.DeviceSelect.open()
    },
    select(item) {
      this.findDevice(item.id)
    },
    findDevice(deviceId) {
      getDevice(deviceId).then((data) => {
        if (data.success) {
          const result = data.result
          if (result.metadata) {
            result.metadata = JSON.parse(result.metadata)
          } else {
            result.metadata = {
              properties: [],
              functions: []
            }
          }
          this.deviceData = result
          this.properties = result.metadata.properties
          this.functions = result.metadata.functions
          const actionData = this.actionData
          if (!actionData.configuration) {
            actionData.configuration = {}
          }
          this.arrayData = [undefined]
          if (actionData.configuration.deviceId) {
            const message = actionData.configuration
            this.messageType = message.messageType
            if (message.messageType === 'WRITE_PROPERTY') {
              _.forEach(result.metadata.properties, (item) => {
                if (item.id === Object.keys(message.properties)[0]) {
                  this.propertiesData = item
                  if (item.type === 'array') {
                    this.arrayData = message.properties[item.id]
                  }
                }
              })
            } else {
              _.forEach(result.metadata.functions, (item) => {
                if (item.id === message.functionId) {
                  this.functionData = item
                }
              })
            }
          }
          actionData.configuration.deviceId = deviceId
          actionData.configuration.productId = result.productId
        }
      })
    },
    propertiesDataChange(value) {
      const find = _.find(this.properties, (p) => p.id === value)
      if (find) {
        this.propertiesData = find
      }
      this.arrayData = [undefined]
      // 清空服务调用
      this.actionData.configuration.functionId = null
      this.actionData.configuration.data = {}
    },
    functionIdChange(value) {
      const find = _.find(this.functions, (p) => p.id === value)
      this.actionData.configuration.data = {}
      if (find) {
        this.functionData = find
        _.forEach(find.inputs, (func) => {
          this.actionData.configuration.data[func.id] = null
        })
      }
      this.actionData.configuration.functionId = value
    }
  }
}
</script>
