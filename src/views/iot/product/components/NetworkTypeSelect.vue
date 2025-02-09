<template>
  <el-select :placeholder="placeholder" v-model="modelValue" :disabled="disabled" v-bind="$attrs">
    <el-option value="MQTT_BROKER" label="MQTT_BROKER"></el-option>
    <el-option value="TCP_SERVER" label="TCP_SERVER"></el-option>
    <el-option value="HTTP_SERVER" label="HTTP_SERVER"></el-option>
    <el-option value="COAP_SERVER" label="COAP_SERVER"></el-option>
    <el-option value="WEBSOCKET_SERVER" label="WEBSOCKET_SERVER"></el-option>
    <el-option value="MQTT_CLIENT" label="MQTT_CLIENT"></el-option>
    <el-option value="TCP_CLIENT" label="TCP_CLIENT"></el-option>
    <el-option value="MODBUS" label="MODBUS_TCP"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'NetworkTypeSelect',
  inheritAttrs: false, // 添加这行以防止属性被添加到根元素
  props: {
    modelValue: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  emits: ['update:modelValue']
}
</script>
