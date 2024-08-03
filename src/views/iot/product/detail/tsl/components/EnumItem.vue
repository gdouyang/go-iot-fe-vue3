<template>
  <div>
    <el-form-item label="枚举项">
      <el-row v-for="(item, index) in arrayEnumData" :key="item.id">
        <el-col :span="10">
          <el-input placeholder="标识" :value="item.value" @change="valueChange($event, index)" />
        </el-col>
        <el-col :span="1" style="text-align: center">
          <a-icon type="arrow-right" />
        </el-col>
        <el-col :span="10">
          <el-input
            placeholder="对该枚举项的描述"
            :value="item.text"
            @change="textChange($event, index)"
          />
        </el-col>
        <el-col :span="3" style="text-align: center">
          <template v-if="index === 0">
            <a-icon v-if="arrayEnumData.length - 1 === 0" type="plus-circle" @click="plus" />
            <a-icon v-else type="minus-circle" @click="minus(index)" />
          </template>
          <template v-else>
            <el-row v-if="index === arrayEnumData.length - 1">
              <a-icon type="plus-circle" @click="plus" />
              <a-icon style="padding-left: 10px" type="minus-circle" @click="minus(index)" />
            </el-row>
            <a-icon v-else type="minus-circle" @click="minus(index)" />
          </template>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script lang="jsx">
import _ from 'lodash-es'
export default {
  name: 'EnumItem',
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    if (_.has(this.data, 'elements') && !_.isEmpty(this.data.elements)) {
      this.arrayEnumData = this.data.elements
    } else {
      this.arrayEnumData = [{ text: '', value: '' }]
    }
  },
  data() {
    return {
      arrayEnumData: []
    }
  },
  mounted() {},
  methods: {
    valueChange(event, index) {
      this.arrayEnumData[index].value = event.target.value
      this.setArrayEnumData([...this.arrayEnumData])
    },
    textChange(event, index) {
      this.arrayEnumData[index].text = event.target.value
      this.setArrayEnumData([...this.arrayEnumData])
    },
    setArrayEnumData(datas) {
      this.arrayEnumData = datas
      this.data.elements = datas
    },
    plus() {
      this.setArrayEnumData([...this.arrayEnumData, { text: '', value: '' }])
    },
    minus(index) {
      this.arrayEnumData.splice(index, 1)
      this.setArrayEnumData([...this.arrayEnumData])
    }
  }
}
</script>
