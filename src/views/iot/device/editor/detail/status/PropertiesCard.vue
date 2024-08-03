<template>
  <ChartCard :bordered="false" :title="item.name" :contentHeight="46">
    <a href="#" slot="extra">
      <a-icon type="sync" />
    </a>
    <div slot="total" class="prop-data" :title="lastData">{{ lastData }}</div>
    <MiniArea :height="40" color="#975FE4" :data="data.visitData" />
  </ChartCard>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import ChartCard from '@/components/Charts/ChartCard.vue'
import MiniArea from '@/components/Charts/MiniArea.vue'
export default {
  name: 'PropertiesCard',
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          name: '',
          expands: {
            readOnly: null
          },
          id: '',
          type: '',
          unit: '',
          list: [],
          value: null,
          visitData: null
        }
      }
    },
    device: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ChartCard,
    MiniArea
  },
  data() {
    return {
      data: {
        visitData: []
      },
      lastData: ''
    }
  },
  created() {
    this.getValue()
  },
  methods: {
    getValue() {
      const item = _.assign(this.data, this.item)
      if (item && !_.isEmpty(item.list)) {
        const length = item.list.length
        const value = item.list[length - 1]
        const dataType = typeof value.value
        if (dataType === 'object') {
          item.value = JSON.stringify(value.value) || '/'
        } else {
          item.value = _.isNil(value.value) ? '/' : value.value
        }

        // 特殊类型
        const valueType = item.type
        if (
          valueType === 'int' ||
          valueType === 'float' ||
          valueType === 'double' ||
          valueType === 'long'
        ) {
          const visitData = []
          item.list.forEach((data) => {
            visitData.push({
              x: data.timeString,
              y: Math.floor(Number(data.value) * 100) / 100
            })
          })
          item.visitData = visitData
        }
      }
      this.data = item
      this.getLastData()
    },
    getLastData() {
      if (_.isNil(this.data.value)) {
        this.lastData = '/'
        return
      }
      const unit = _.toString(this.item.unit)
      if (typeof this.data.value === 'object') {
        this.lastData = JSON.stringify(this.data.value)
      } else {
        this.lastData = this.data.value + unit
      }
    }
  }
}
</script>

<style lang="less" scoped>
.card-value {
  color: rgba(0, 0, 0, 0.85);
  font-size: 30px;
  overflow: hidden;
  line-height: 38px;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
}
.prop-data {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
