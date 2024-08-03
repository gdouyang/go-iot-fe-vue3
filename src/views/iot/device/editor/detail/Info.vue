<template>
  <div>
    <ContentWrap>
      <el-descriptions bordered :column="2" size="small">
        <span slot="title">
          设备信息
          <el-button
            icon="edit"
            :style="{ marginLeft: 20 }"
            type="link"
            @click="openBasicInfo"
            v-action:device-mgr:save
            >编辑</el-button
          >
        </span>
        <el-descriptions-item label="产品名称" :span="1">{{
          device.productName
        }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="1">{{ GetCreateTime }}</el-descriptions-item>
        <el-descriptions-item label="说明" :span="2">{{
          device.desc || device.desc
        }}</el-descriptions-item>
      </el-descriptions>

      <!-- <div style="width: 100%;margin-top: 10px;" v-if="configuration.length">
        <el-descriptions :style="{marginBottom: 20}" :column="3" size="small">
          <span slot="title">
            位置
            <el-button icon="edit" :style="{marginLeft: 20}" type="link" @click="editLocation">编辑</el-button>
          </span>
        </el-descriptions>
        <el-descriptions bordered :column="2" title="">
          <el-descriptions-item>
            <span slot="label">
              经度
            </span>
            <span>{{ extendData.longitude }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <span slot="label">
              纬度
            </span>
            <span>{{ extendData.latitude }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div> -->

      <Configuration :device="device" @refresh="refresh" />
    </ContentWrap>

    <DeviceAdd ref="DeviceAdd" @success="refresh" v-if="deviceVisible" />
    <LocationConfig ref="LocationConfig" @success="selectLocation" />
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import { updateLocation } from '@/views/iot/device/api.js'
import DeviceAdd from '../../modules/DeviceAdd.vue'
import Configuration from './Configuration.vue'
import LocationConfig from '@/components/tools/LocationConfig.vue'

export default {
  name: 'DeviceInfo',
  props: {
    device: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    DeviceAdd,
    Configuration,
    LocationConfig
  },
  data() {
    return {
      deviceVisible: false,
      extendData: {
        deviceId: null,
        longitude: null, // 经度
        latitude: null // 纬度
      }
    }
  },
  created() {},
  computed: {
    GetCreateTime() {
      return moment(this.device.createTime).format('YYYY-MM-DD HH:mm:ss')
    },
    deviceId() {
      const { id } = this.device
      return id
    }
  },
  methods: {
    refresh() {
      this.$emit('refresh')
    },
    openBasicInfo() {
      this.deviceVisible = true
      this.$nextTick(() => {
        this.$refs.DeviceAdd.edit(this.device)
      })
    },
    editLocation() {
      this.$refs.LocationConfig.open(this.extendData)
    },
    selectLocation(value) {
      const param = {
        deviceId: this.extendData.deviceId,
        longitude: value.longitude,
        latitude: value.latitude
      }
      updateLocation(param).then((resp) => {
        if (resp.success) {
          this.$message.success('操作成功')
          this.$refs.LocationConfig.close()
        } else {
          this.$message.success(resp.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
