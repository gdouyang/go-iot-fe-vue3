<template>
  <a-spin tip="加载中..." :spinning="loading">
    <PageHeaderWrapper
      :style="{ marginTop: '0px', backgroundColor: '#F0F2F5', paddingBottom: '10px' }"
      :tabList="tableList"
      :tabActiveKey="ActiveTabKey"
      @tabChange="onTabChange"
      @back="back"
    >
      <span slot="extra">
        <el-tooltip title="刷新">
          <a-icon type="sync" :style="{ fontSize: '20px' }" @click="reloadDevice" />
        </el-tooltip>
      </span>
      <div slot="title">
        <el-row>
          <span class="detail-title">
            <span>设备：{{ GetDeviceId }}</span>
          </span>
          <el-badge
            :color="DeviceState === 'online' ? 'green' : 'red'"
            :text="DeviceState"
            style="margin-left: 10px"
          />
          <span v-action:device-mgr:save>
            <el-popconfirm
              title="确认让此设备断开连接？"
              @confirm="disconnectDevice"
              v-if="DeviceState === 'online'"
            >
              <a style="font-size: 12px; margin-left: 10px">断开连接</a>
            </el-popconfirm>
            <el-popconfirm
              title="确认激活此设备？"
              @confirm="changeDeploy"
              v-else-if="DeviceState === 'noActive'"
            >
              <a style="font-size: 12px; margin-left: 10px">激活设备</a>
            </el-popconfirm>
            <el-popconfirm
              title="确认连接设备？"
              @confirm="connectDevice"
              v-else-if="isNetClientType"
            >
              <a style="font-size: 12px; margin-left: 10px">连接</a>
            </el-popconfirm>
          </span>
        </el-row>
      </div>
      <div slot="content">
        <el-descriptions :column="4">
          <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
          <el-descriptions-item label="名称">{{ detailData.name }}</el-descriptions-item>
          <el-descriptions-item label="产品">
            <div>
              {{ detailData.productName }}
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template v-if="ActiveTabKey === 'info'">
        <Info :device="detailData" v-if="detailData.id" @refresh="reloadDevice"></Info>
      </template>
      <template v-if="ActiveTabKey === 'status'">
        <Status :device="detailData" @refresh="reloadDevice" :realtimeData="realtimeData"></Status>
      </template>
      <template v-if="ActiveTabKey === 'function'">
        <Function :device="detailData"></Function>
      </template>
      <template v-if="ActiveTabKey === 'log'">
        <Log :deviceId="detailData.id" v-if="detailData.id"></Log>
      </template>
      <template v-if="ActiveTabKey === 'properties'">
        <Properties :device="detailData" v-if="detailData.id" />
      </template>
      <template v-if="ActiveTabKey === 'events'">
        <Events :device="detailData" v-if="detailData.id" />
      </template>
    </PageHeaderWrapper>
  </a-spin>
</template>

<script lang="jsx">
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { getDetail, connect, disconnect, deploy, getEventBusUrl } from '@/views/iot/device/api.js'
import Info from './detail/Info.vue'
import Status from './detail/Status.vue'
import Function from './detail/Function.vue'
import Log from './detail/Log.vue'
import Properties from './detail/Properties.vue'
import Events from './detail/Events.vue'

export default {
  name: 'DeviceDetail',
  components: {
    PageHeaderWrapper,
    Info,
    Status,
    Function,
    Log,
    Properties,
    Events
  },
  data() {
    return {
      loading: true,
      detailData: {},
      ActiveTabKey: 'info',
      tableList: [
        { key: 'info', tab: '实例信息' },
        { key: 'status', tab: '运行状态' },
        { key: 'function', tab: '设备功能' },
        { key: 'properties', tab: '设备属性' },
        { key: 'events', tab: '设备事件' },
        { key: 'log', tab: '日志' }
      ],
      realtimeData: {}
    }
  },
  created() {
    this.connectWs()
  },
  mounted() {
    const { id } = this.$route.query
    this.getDeviceDetail(id).then((result) => {
      if (result) {
        this.detailData = result
      }
    })
  },
  destroyed() {
    if (this.ws) {
      this.ws.close()
    }
  },
  computed: {
    GetDeviceId() {
      return this.$route.query.id
    },
    DeviceState() {
      const status = this.detailData.state
      return status
    },
    isNetClientType() {
      return (
        this.detailData.networkType === 'TCP_CLIENT' ||
        this.detailData.networkType === 'MQTT_CLIENT' ||
        this.detailData.networkType === 'MODBUS'
      )
    }
  },
  methods: {
    back() {
      this.$emit('back')
    },
    onTabChange(key) {
      if (!this.detailData.metadata) {
        this.$message.error('请检查产品物模型')
        return
      }
      this.ActiveTabKey = key
    },
    getDeviceDetail(id) {
      this.loading = true
      return getDetail(id)
        .then((data) => {
          if (data.success) {
            return data.result
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    reloadDevice() {
      this.getDeviceDetail(this.GetDeviceId).then((result) => {
        if (result) {
          this.detailData = result
        }
      })
    },
    disconnectDevice() {
      const deviceId = this.GetDeviceId
      disconnect(deviceId).then((data) => {
        if (data.success) {
          this.$message.success('断开连接成功')
          this.reloadDevice()
        }
      })
    },
    changeDeploy() {
      const deviceId = this.GetDeviceId
      deploy(deviceId).then((data) => {
        if (data.success) {
          this.$message.success('激活成功')
          this.reloadDevice()
        }
      })
    },
    connectDevice() {
      const deviceId = this.GetDeviceId
      connect(deviceId).then((data) => {
        if (data.success) {
          this.$message.success('连接成功')
          this.reloadDevice()
        }
      })
    },
    connectWs() {
      var ws = (this.ws = new WebSocket(getEventBusUrl(this.GetDeviceId, '*')))
      ws.onopen = function (evt) {
        console.log('Connection open ...')
      }

      ws.onmessage = (evt) => {
        console.log('Received Message: ' + evt.data)
        var data = JSON.parse(evt.data)
        if (data.type === 'online') {
          this.detailData.state = 'online'
        } else if (data.type === 'offline') {
          this.detailData.state = 'offline'
        } else if (data.type === 'property' || data.type === 'event') {
          this.realtimeData = data
        }
      }

      ws.onclose = (evt) => {
        console.log('Connection closed.')
        this.ws = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.deviceInsTitle {
  display: flex;
  flex-direction: column;
}
</style>
