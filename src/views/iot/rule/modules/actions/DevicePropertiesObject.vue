<template>
  <div>
    <div v-if="properties.type === 'enum'">
      <el-col :span="4">
        <el-select placeholder="选择属性值" :defaultValue="defaultValue" @change="selectChange">
          <el-option v-if="item in properties.elements" :key="item.value">{{
            `${item.text}（${item.value}）`
          }}</el-option>
        </el-select>
      </el-col>
    </div>
    <div v-else-if="properties.type === 'bool'">
      <el-col :span="4">
        <el-select placeholder="选择属性值" :defaultValue="defaultValue" @change="selectChange">
          <el-option :key="properties.trueValue">
            {{ `${properties.trueText}（${properties.trueValue}）` }}
          </el-option>
          <el-option :key="properties.falseValue">
            {{ `${properties.falseText}（${properties.falseValue}）` }}
          </el-option>
        </el-select>
      </el-col>
    </div>
    <div v-else>
      <el-col :span="4">
        <el-input
          key="value"
          placeholder="填写属性值"
          :defaultValue="defaultValue"
          @change="inputChange"
        />
      </el-col>
    </div>
  </div>
</template>

<script lang="jsx">
export default {
  name: 'DevicePropertiesObject',
  props: {
    properties: {
      type: Object,
      default: null
    },
    actionData: {
      type: Object,
      default: null
    },
    propertiesData: {
      type: Object,
      default: null
    }
  },
  components: {},
  created() {
    const propertiesData = this.propertiesData
    const properties = this.properties
    const actionData = this.actionData
    const message = actionData.configuration.message
    this.defaultValue =
      (message &&
        message.properties &&
        message.properties[propertiesData.id] &&
        message.properties[propertiesData.id][properties.id]) ||
      undefined
  },
  data() {
    return {
      defaultValue: ''
    }
  },
  methods: {
    selectChange(value) {
      const propertiesData = this.propertiesData
      const properties = this.properties
      if (!this.actionData.configuration.message.properties[propertiesData.id]) {
        this.actionData.configuration.message.properties[propertiesData.id] = {}
      }
      this.actionData.configuration.message.properties[propertiesData.id][properties.id] = value
    },
    inputChange($event) {
      const propertiesData = this.propertiesData
      const properties = this.properties
      if (!this.actionData.configuration.message.properties[propertiesData.id]) {
        this.actionData.configuration.message.properties[propertiesData.id] = {}
      }
      this.actionData.configuration.message.properties[propertiesData.id][properties.id] =
        $event.target.value
    }
  }
}
</script>
