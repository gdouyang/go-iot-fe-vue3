<template>
  <el-form-item label="枚举项">
    <el-row v-for="(item, index) in arrayEnumData" :key="item.id" class="enum-item">
      <el-col :span="10">
        <el-input placeholder="标识" v-model="item.value" />
      </el-col>
      <el-col :span="1" style="text-align: center">
        <Icon icon="carbon:arrow-right" />
      </el-col>
      <el-col :span="10">
        <el-input placeholder="对该枚举项的描述" v-model="item.text" />
      </el-col>
      <el-col :span="3" style="text-align: center">
        <div>
          <Icon
            v-if="index === arrayEnumData.length - 1"
            icon="carbon:add-alt"
            title="添加"
            @click="plus"
          />
          <Icon
            v-if="arrayEnumData.length > 1"
            icon="carbon:subtract-alt"
            title="删除"
            style="margin-left: 10px"
            @click="minus(index)"
          />
        </div>
      </el-col>
    </el-row>
  </el-form-item>
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
      this.data.elements = this.arrayEnumData
    }
  },
  data() {
    return {
      arrayEnumData: []
    }
  },
  mounted() {},
  methods: {
    plus() {
      this.arrayEnumData.push({ text: '', value: '' })
    },
    minus(index) {
      this.arrayEnumData.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.enum-item {
  width: 100%;
  .el-icon {
    cursor: pointer;
  }
}
</style>
