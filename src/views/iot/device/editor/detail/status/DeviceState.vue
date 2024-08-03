<template>
  <ChartCard :bordered="false" title="设备状态" :contentHeight="46" :total="state">
    <!-- <a href="#" slot="action">
      <a-icon type="sync" />
    </a> -->
    <span v-if="state === 'online'">上线时间：{{ time }}</span>
    <span v-if="state === 'offline'">离线时间：{{ time }}</span>
  </ChartCard>
</template>

<script lang="jsx">
import ChartCard from '@/components/Charts/ChartCard'
import { queryLogs } from '@/views/iot/device/api.js'
// eslint-disable-next-line no-unused-vars
// import moment from 'moment'
export default {
  name: 'DeviceState',
  props: {
    state: {
      type: String,
      default: () => ''
    },
    device: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    ChartCard
  },
  data() {
    return {
      time: ''
    }
  },
  mounted() {
    this.GetTime()
  },
  methods: {
    GetTime() {
      if (this.state === 'online' || this.state === 'offline') {
        queryLogs(this.device.id, {
          pageSize: 1,
          condition: [{ key: 'type', value: this.state }]
        }).then((resp) => {
          if (resp.success && resp.result.list.length > 0) {
            this.time = resp.result.list[0].createTime
          }
        })
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
</style>
