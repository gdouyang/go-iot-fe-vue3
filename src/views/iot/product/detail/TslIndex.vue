<template>
  <ContentWrap :style="{ marginBottom: '20px' }" v-loading="loading">
    <div style="display: inline-block; position: absolute; right: 14px; z-index: 10">
      <el-button @click="importTSL" style="margin-right: 5px">导入物模型</el-button>
      <el-button @click="showTSL">物模型</el-button>
    </div>
    <el-tabs model-value="1">
      <el-tab-pane label="属性定义" name="1">
        <Properties :product="product" :data="propertyData" @save="saveProperties" />
      </el-tab-pane>
      <el-tab-pane label="功能定义" name="2">
        <Functions :product="product" :data="functionsData" @save="saveFunctions" />
      </el-tab-pane>
      <el-tab-pane label="事件定义" name="3">
        <Events :data="eventsData" @save="saveEvents" />
      </el-tab-pane>
    </el-tabs>
    <TslImportDialog ref="TslImportDialog" @import="saveAll" />
  </ContentWrap>
</template>

<script lang="jsx">
// import _ from 'lodash-es'
import Properties from './tsl/Properties.vue'
import Functions from './tsl/Functions.vue'
import Events from './tsl/Events.vue'
import TslImportDialog from './tsl/TslImportDialog.vue'
export default {
  name: 'TSL',
  components: {
    Properties,
    Functions,
    Events,
    TslImportDialog
  },
  props: {
    product: {
      type: Object,
      default: () => {}
    },
    propertyData: {
      type: [Object, Array],
      default: () => null
    },
    functionsData: {
      type: [Object, Array],
      default: () => null
    },
    eventsData: {
      type: [Object, Array],
      default: () => null
    }
  },
  data() {
    return {
      properties: [],
      loading: false
    }
  },
  mounted() {},
  methods: {
    saveProperties(data, onlySave) {
      this.$emit('save', 'properties', data, onlySave)
    },
    saveFunctions(data, onlySave) {
      this.$emit('save', 'function', data, onlySave)
    },
    saveEvents(data, onlySave) {
      this.$emit('save', 'event', data, onlySave)
    },
    saveAll(data, onlySave) {
      this.$emit('save', 'all', data, onlySave)
    },
    importTSL() {
      this.$refs.TslImportDialog.open(null, true)
    },
    showTSL() {
      this.$refs.TslImportDialog.open(this.product.metadata)
    }
  }
}
</script>

<style lang="less" scoped></style>
