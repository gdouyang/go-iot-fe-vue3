<template>
  <div :title="title">
    <slot></slot>
    <Echart v-if="data && data.length > 0" :options="lineOptionsData" :height="350" />
  </div>
</template>

<script lang="jsx">
// import _ from 'lodash-es'
export default {
  name: 'ChartCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {
        return []
      }
    }
  },
  components: {},
  data() {
    return {
      data: [],
      lineOptionsData: {
        xAxis: {
          data: []
        },
        yAxis: {
          data: []
        }
      }
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
