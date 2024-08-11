<template>
  <div>
    <ContentWrap>
      <div>
        <el-form label-width="auto">
          <el-row :gutter="{ md: 8, lg: 4, xl: 48 }">
            <el-col :md="6" :sm="24">
              <el-form-item label="事件">
                <el-select v-model="eventId" @change="onEventIdChange">
                  <el-option
                    v-for="(item, index) in events"
                    :key="index"
                    :value="item.id"
                    :label="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="24">
              <el-form-item label="日期">
                <el-date-picker
                  v-model="searchParams.createTime"
                  type="datetimerange"
                  :format="'YYYY-MM-DD HH:mm:ss'"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  @change="(date) => (searchParams.createTime = date)"
                />
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="24">
              <div :style="{ overflow: 'hidden' }">
                <div :style="{ marginLeft: '10px' }">
                  <el-button icon="search" type="primary" @click="search"> 查询 </el-button>
                  <el-button :style="{ marginLeft: '8px' }" @click="resetSearch"> 重置 </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <PageTable ref="tb" :columns="columns" :url="tableUrl" v-if="tableUrl"> </PageTable>
    </ContentWrap>
  </div>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import dayjs from 'dayjs'
import { getDeviceEventsUrl } from '@/views/iot/device/api.js'
export default {
  name: 'Events',
  props: {
    device: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableUrl: '',
      columns: [],
      searchParams: {
        createTime: []
      },
      events: [],
      eventId: ''
    }
  },
  mounted() {
    const metadata = JSON.parse(this.device.metadata)
    this.events = metadata.events
    if (_.isEmpty(this.events)) {
      return
    }
    this.eventId = this.events[0].id
    this.onEventIdChange()
  },
  methods: {
    onEventIdChange() {
      this.tableUrl = getDeviceEventsUrl(this.device.id, this.eventId)
      const event = _.find(this.events, (ev) => ev.id === this.eventId)
      const columns = []
      if (event) {
        if (event.type === 'object') {
          _.forEach(event.properties, (prop) => {
            columns.push({ field: prop.id, label: prop.name })
          })
        } else {
          columns.push({ field: event.id, label: event.name })
        }
      }
      columns.push({ field: 'createTime', label: '时间' })
      this.columns = columns
      this.$nextTick(() => {
        this.resetSearch()
      })
    },
    search() {
      const params = []
      if (!_.isEmpty(this.searchParams.createTime)) {
        const formatDate = this.searchParams.createTime.map((e) =>
          dayjs(e).format('YYYY-MM-DD HH:mm:ss')
        )
        params.push({ key: 'createTime', oper: 'BTW', value: formatDate.join(',') })
      }
      this.$refs.tb.search(params)
    },
    resetSearch() {
      this.searchParams = {
        createTime: []
      }
      this.search()
    }
  }
}
</script>

<style lang="less" scoped></style>
