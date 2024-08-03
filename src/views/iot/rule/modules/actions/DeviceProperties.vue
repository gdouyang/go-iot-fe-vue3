<template>
  <div>
    <div v-if="propertiesData.type === 'enum'">
      <el-col :span="4">
        <el-select placeholder="选择属性值" :defaultValue="defaultValue" @change="selectChange">
          <el-option v-for="item in propertiesData.elements" :key="item.value">{{
            `${item.text}（${item.value}）`
          }}</el-option>
        </el-select>
      </el-col>
    </div>
    <div v-else-if="propertiesData.type === 'array'">
      <el-col :span="24">
        <el-row v-for="(value, index) in arrayData" :key="`array_${index}`">
          <el-col :span="4">
            <el-input v-model="arrayData[index]" @change="arrayInputChange($event, index)" />
          </el-col>
          <el-col :span="2">
            <template v-if="index === 0">
              <a-icon v-if="arrayData.length - 1 === 0" type="plus-circle" @click="arrayPlus" />
              <a-icon v-else type="minus-circle" @click="arrayMinus(index)" />
            </template>
            <template v-else>
              <el-row v-if="index === arrayData.length - 1">
                <a-icon type="plus-circle" @click="arrayPlus" />
                <a-icon style="paddingleft: 10" type="minus-circle" @click="arrayMinus(index)" />
              </el-row>
              <a-icon v-else type="minus-circle" @click="arrayMinus(index)" />
            </template>
          </el-col>
        </el-row>
      </el-col>
    </div>
    <div v-else-if="propertiesData.type === 'boolean'">
      <el-col
        v-if="$_.isNil(propertiesData.trueValue) || $_.isNil(propertiesData.falseValue)"
        :span="4"
      >
        <el-input
          key="value"
          placeholder="填写属性值"
          :defaultValue="defaultValue"
          @change="inputChange"
        />
      </el-col>
      <el-col :span="4" v-else>
        <el-select placeholder="选择属性值" :defaultValue="defaultValue" @change="selectChange">
          <el-option :key="propertiesData.trueValue + ''">
            {{ `${propertiesData.trueText}（${propertiesData.trueValue}）` }}
          </el-option>
          <el-option :key="propertiesData.falseValue + ''">
            {{ `${propertiesData.falseText}（${propertiesData.falseValue}）` }}
          </el-option>
        </el-select>
      </el-col>
    </div>
    <div v-else-if="propertiesData.type === 'object'">
      <el-col
        :span="24"
        v-for="(item, index) in propertiesData.properties"
        :key="`object${item.id}_${index}`"
      >
        <div>
          <el-col :span="4">
            <el-input :value="`${item.name}(${item.id})`" :disabled="true" />
          </el-col>
          <PropertiesObject
            :properties="item"
            :actionData="actionData"
            :propertiesData="propertiesData"
          />
        </div>
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
import _ from 'lodash-es'
import PropertiesObject from './DevicePropertiesObject.vue'
export default {
  name: 'DeviceProperties',
  props: {
    propertiesData: {
      type: Object,
      default: () => {}
    },
    actionData: {
      type: Object,
      default: () => {}
    },
    arrayData: {
      type: Array,
      default: () => []
    }
  },
  components: {
    PropertiesObject
  },
  watch: {
    actionData: {
      handler() {
        this.setDefaultValue()
      },
      deep: true
    }
  },
  created() {
    this.setDefaultValue()
  },
  data() {
    return {
      defaultValue: ''
    }
  },
  methods: {
    setDefaultValue() {
      const propertiesData = this.propertiesData
      const actionData = this.actionData
      this.defaultValue =
        actionData.configuration.message.properties[propertiesData.id] || undefined
    },
    selectChange(value) {
      const propertiesData = this.propertiesData
      this.actionData.configuration.message.properties[propertiesData.id] = value
    },
    inputChange($event) {
      const propertiesData = this.propertiesData
      this.actionData.configuration.message.properties[propertiesData.id] = $event.target.value
    },
    arrayInputChange($event, index) {
      const actionData = this.actionData
      const propertiesData = this.propertiesData
      const arrayData = this.arrayData
      arrayData[index] = $event.target.value
      actionData.configuration.message.properties[propertiesData.id] = arrayData
    },
    arrayPlus() {
      const actionData = this.actionData
      const propertiesData = this.propertiesData
      const arrayData = this.arrayData
      arrayData.push(undefined)
      actionData.configuration.message.properties[propertiesData.id] = arrayData
    },
    arrayMinus(index) {
      const actionData = this.actionData
      const propertiesData = this.propertiesData
      _.isEmpty(index)
      // const newArray = _.filter(this.arrayData, (val, idx) => idx !== index)
      // this.$emit('udpate:arrayData', newArray)
      // const arrayData = newArray
      const arrayData = this.arrayData
      arrayData.splice(index, 1)
      actionData.configuration.message.properties[propertiesData.id] = arrayData
    }
  }
}
</script>
