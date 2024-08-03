<template>
  <a-spin tip="加载中..." :spinning="loading">
    <el-button @click="back">返回</el-button>
    <div :style="{ marginTop: 30 }" slot="title">
      <el-row>
        <span class="detail-title">
          <span>产品：{{ detailData.name }}</span>
        </span>
        <el-badge
          :color="detailData.state ? 'green' : 'red'"
          :text="detailData.state ? '发布' : '停用'"
          style="margin-left: 10px"
        />
        <span v-action:product-mgr:save>
          <el-popconfirm title="确认停用？" @confirm="unDeploy" v-if="detailData.state">
            <a style="font-size: 12px; margin-left: 10px">停用</a>
          </el-popconfirm>
          <el-popconfirm title="确认发布？" @confirm="deploy" v-if="!detailData.state">
            <a style="font-size: 12px; margin-left: 10px">发布</a>
          </el-popconfirm>
          <el-tooltip title="修改物模型后需要重新应用配置" placement="bottom">
            <el-popconfirm title="确认重新应用该配置？" @confirm="deploy" v-if="detailData.state">
              <a style="font-size: 12px; margin-left: 10px">应用配置</a>
            </el-popconfirm>
          </el-tooltip>
        </span>
      </el-row>
    </div>
    <el-card>
      <el-tabs model-value="info">
        <el-tab-pane name="info" label="基本信息">
          <Info :data="detailData" v-if="detailData.id" @refresh="reloadDevice"></Info>
        </el-tab-pane>
        <!-- <el-tab-pane name="tsl" label="物模型">
            <TSL
              :product="detailData"
              :propertyData="properties"
              :functionsData="functions"
              :eventsData="events"
              @refresh="reloadDevice"
              @save="updateData"
            ></TSL>
          </el-tab-pane>
          <el-tab-pane name="codec" label="编解码">
            <Codec
              :id="GetId"
              :product="detailData"
              @refresh="reloadDevice"
              @save="updateData"
            ></Codec>
          </el-tab-pane> -->
      </el-tabs>
    </el-card>
  </a-spin>
</template>

<script lang="jsx">
import { deploy, undeploy, get, modifyTsl } from '@/views/iot/product/api.js'
import Info from './detail/Info.vue'
// import TSL from './detail/TslIndex.vue'
// import Codec from './detail/Codec.vue'

export default {
  name: 'ProductDetialIndex',
  mixins: [],
  components: {
    Info
    // TSL,
    // Codec
  },
  data() {
    return {
      loading: true,
      detailData: {},
      properties: [],
      functions: [],
      events: []
    }
  },
  mounted() {
    this.reloadDevice()
  },
  computed: {
    GetId() {
      return this.$route.query.id
    }
  },
  methods: {
    back() {
      this.$emit('back')
    },
    getDetail(id) {
      this.loading = true
      return get(id)
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
      this.getDetail(this.GetId).then((result) => {
        if (result) {
          this.detailData = result
          if (result.metadata) {
            result.metadata = JSON.parse(result.metadata)
            const metadata = result.metadata
            this.events = metadata.events
            this.functions = metadata.functions
            this.properties = metadata.properties
          }
        }
      })
    },
    unDeploy() {
      const id = this.GetId
      undeploy(id).then((data) => {
        if (data.success) {
          this.$message.success('操作成功')
          this.reloadDevice()
        }
      })
    },
    deploy() {
      const id = this.GetId
      deploy(id).then((data) => {
        if (data.success) {
          this.$message.success('操作成功')
          this.reloadDevice()
        }
      })
    },
    updateData(type, item, onlySave) {
      const events = this.events
      const properties = this.properties
      const functions = this.functions
      let metadata = { events, properties, functions }
      if (type === 'event') {
        metadata = { events: item, properties, functions }
      } else if (type === 'properties') {
        metadata = { events, properties: item, functions }
      } else if (type === 'function') {
        metadata = { events, properties, functions: item }
      } else if (type === 'all') {
        metadata = { events: item.events, properties: item.properties, functions: item.functions }
      }
      const basicInfo = this.detailData
      const data = { metadata: JSON.stringify(metadata) }
      modifyTsl(basicInfo.id, data)
        .then((re) => {
          if (re.success) {
            this.$message.success('保存成功，如需生效请重新应用配置')
          }
        })
        .finally(() => {
          this.reloadDevice()
        })
    },
    toProductPage() {}
  }
}
</script>

<style lang="less" scoped>
.deviceInsTitle {
  display: flex;
  flex-direction: column;
}
</style>
