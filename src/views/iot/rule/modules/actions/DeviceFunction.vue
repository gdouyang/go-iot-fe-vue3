<template>
  <el-col v-if="item.type === 'enum'" :span="6">
    <el-select placeholder="选择调用参数" :model-value="defaultValue" @change="inputsChange">
      <el-option
        v-for="_item in item.elements"
        :key="_item.value"
        :value="_item.value"
        :label="`${_item.text}（${_item.value}）`"
      >
      </el-option>
    </el-select>
  </el-col>
  <el-col v-else-if="item.type === 'bool'" :span="6">
    <el-select placeholder="选择调用参数" :model-value="defaultValue" @change="inputsChange">
      <el-option :value="item.trueValue + ''" :label="`${item.trueText}（${item.trueValue}）`">
      </el-option>
      <el-option :value="item.falseValue + ''" :label="`${item.falseText}（${item.falseValue}）`">
      </el-option>
    </el-select>
  </el-col>
  <el-col
    v-else-if="
      item.type === 'int' || item.type === 'long' || item.type === 'float' || item.type === 'double'
    "
    :span="6"
  >
    <el-input-number
      :model-value="defaultValue"
      controls-position="right"
      @change="inputsChange"
    ></el-input-number>
  </el-col>
  <el-col v-else-if="item.type === 'password'" :span="6">
    <el-input
      type="password"
      show-password
      :model-value="defaultValue"
      :maxlength="100"
      @change="inputsChange"
    ></el-input>
  </el-col>
  <el-col v-else :span="6">
    <el-input placeholder="填写调用参数" :model-value="defaultValue" @change="inputsInputChange" />
  </el-col>
</template>

<script lang="jsx">
export default {
  name: 'DeviceFunction',
  props: {
    item: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: null
    },
    actionData: {
      type: Object,
      default: null
    }
  },
  components: {},
  created() {},
  computed: {
    defaultValue() {
      const message = this.actionData.configuration
      const item = this.item
      if (item && message) {
        return message && message.data && message.data[item.id]
      }
      return null
    }
  },
  data() {
    return {}
  },
  methods: {
    inputsChange(value) {
      const item = this.item
      this.actionData.configuration.data = {}
      this.actionData.configuration.data[item.id] = value
    },
    inputsInputChange($event) {
      const item = this.item
      this.actionData.configuration.data = {}
      this.actionData.configuration.data[item.id] = $event.target.value
    }
  }
}
</script>
