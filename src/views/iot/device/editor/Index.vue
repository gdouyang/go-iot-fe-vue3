<template>
  <ContentDetailWrap :header-border="false">
    <template #header>
      <el-row class="el-descriptions__title" style="align-items: center">
        <BaseButton @click="back" circle size="small"><Icon icon="carbon:arrow-left" /></BaseButton>
        <span class="detail-title">
          <span>设备：{{ GetDeviceId }}</span>
        </span>
        <el-tag :type="DeviceState === 'online' ? 'success' : 'info'" round size="small">{{
          DeviceState === 'online' ? '在线' : DeviceState === 'offline' ? '离线' : '未激活'
        }}</el-tag>
        <span v-action:device-mgr:save>
          <el-popconfirm
            v-if="DeviceState === 'online'"
            title="确认让此设备断开连接？"
            @confirm="disconnectDevice"
          >
            <template #reference>
              <el-button link type="primary" class="link">断开连接</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            title="确认激活此设备？"
            @confirm="changeDeploy"
            v-else-if="DeviceState === 'noActive'"
          >
            <template #reference>
              <el-button link type="primary" class="link">激活设备</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            title="确认连接设备？"
            @confirm="connectDevice"
            v-else-if="isNetClientType"
          >
            <template #reference>
              <el-button link type="primary" class="link">连接</el-button>
            </template>
          </el-popconfirm>
        </span>
        <el-tooltip content="刷新">
          <BaseButton @click="reloadDevice" circle size="small"
            ><Icon icon="carbon:renew"
          /></BaseButton>
        </el-tooltip>
      </el-row>
    </template>
    <div>
      <el-descriptions :column="4">
        <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="产品">
          {{ detailData.productName }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-tabs model-value="info">
      <el-tab-pane name="info" label="基本信息"> </el-tab-pane>
      <el-tab-pane name="status" label="运行状态"> </el-tab-pane>
      <el-tab-pane name="properties" label="设备属性"> </el-tab-pane>
      <el-tab-pane name="function" label="设备功能"> </el-tab-pane>
      <el-tab-pane name="events" label="设备事件"> </el-tab-pane>
      <el-tab-pane name="log" label="日志"> </el-tab-pane>
    </el-tabs>
    <template v-if="ActiveTabKey === 'info'">
      <Info v-if="detailData.id" :device="detailData" @refresh="reloadDevice"></Info>
    </template>
    <template v-if="ActiveTabKey === 'status'">
      <Status
        v-if="detailData.id"
        :device="detailData"
        @refresh="reloadDevice"
        :realtimeData="realtimeData"
      ></Status>
    </template>
    <template v-if="ActiveTabKey === 'function'">
      <Function v-if="detailData.id" :device="detailData"></Function>
    </template>
    <template v-if="ActiveTabKey === 'log'">
      <Log v-if="detailData.id" :deviceId="detailData.id"></Log>
    </template>
    <template v-if="ActiveTabKey === 'properties'">
      <Properties v-if="detailData.id" :device="detailData" />
    </template>
    <template v-if="ActiveTabKey === 'events'">
      <Events v-if="detailData.id" :device="detailData" />
    </template>
  </ContentDetailWrap>
</template>

<script lang="jsx">
import { getDetail, connect, disconnect, deploy, getEventBusUrl } from '../api.js'
import Info from './detail/Info.vue'
import Status from './detail/Status.vue'
import Function from './detail/Function.vue'
import Log from './detail/Log.vue'
import Properties from './detail/Properties.vue'
import Events from './detail/Events.vue'

export default {
  name: 'DeviceDetail',
  components: {
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
