<template>
  <div>
    <div v-if="item.type === 'enum'">
      <el-col :span="6">
        <el-select placeholder="选择调用参数" :value="defaultValue" @change="inputsChange">
          <el-option v-for="_item in item.elements" :key="_item.value" :value="_item.value">
            {{ `${_item.text}（${_item.value}）` }}
          </el-option>
        </el-select>
      </el-col>
    </div>
    <div v-else-if="item.type === 'bool'">
      <el-col :span="6">
        <el-select placeholder="选择调用参数" :value="defaultValue" @change="inputsChange">
          <el-option :value="item.trueValue + ''">
            {{ `${item.trueText}（${item.trueValue}）` }}
          </el-option>
          <el-option :value="item.falseValue + ''">
            {{ `${item.falseText}（${item.falseValue}）` }}
          </el-option>
        </el-select>
      </el-col>
    </div>
    <div
      v-else-if="
        item.type === 'int' ||
        item.type === 'long' ||
        item.type === 'float' ||
        item.type === 'double'
      "
    >
      <el-col :span="6">
        <el-input-number :value="defaultValue" @change="inputsChange"></el-input-number>
      </el-col>
    </div>
    <div v-else-if="item.type === 'password'">
      <el-col :span="6">
        <el-input
          type="password"
          :value="defaultValue"
          @change="inputsChange"
          :maxlength="100"
        ></el-input>
      </el-col>
    </div>
    <div v-else>
      <el-col :span="6">
        <el-input placeholder="填写调用参数" :value="defaultValue" @change="inputsInputChange" />
      </el-col>
    </div>
  </div>
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
