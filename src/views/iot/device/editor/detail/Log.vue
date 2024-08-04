<template>
  <div>
    <ContentWrap>
      <div>
        <el-form label-width="auto">
          <el-row :gutter="{ md: 8, lg: 4, xl: 48 }">
            <el-col :md="5" :sm="24">
              <el-form-item label="日志类型">
                <el-select mode="multiple" v-model="searchParams.type">
                  <el-option v-for="(item, index) in selectOptions" :key="index" :value="item.id">
                    {{ item.name }}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="5" :sm="24">
              <el-form-item label="TraceId">
                <el-input v-model="searchParams.traceId" maxlength="100" />
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
                  <el-button type="primary" @click="search"> 查询 </el-button>
                  <el-button @click="resetSearch"> 重置 </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <PageTable ref="tb" :columns="columns" :url="tableUrl"> </PageTable>
    </ContentWrap>
  </div>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import dayjs from 'dayjs'
import { getDeviceLogsUrl } from '@/views/iot/device/api.js'
export default {
  name: 'DeviceLog',
  props: {
    deviceId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      tableUrl: '',
      selectOptions: [
        // { id: 'event', name: '事件上报' },
        // { id: 'readProperty', name: '属性读取' },
        // { id: 'writeProperty', name: '属性修改' },
        // { id: 'reportProperty', name: '属性上报' },
        { id: 'call', name: '调用' },
        { id: 'reply', name: '回复' },
        { id: 'offline', name: '下线' },
        { id: 'online', name: '上线' }
        // { id: 'other', name: '其它' }
      ],
      columns: [
        { field: 'type', label: '类型', width: '120px' },
        { field: 'traceId', label: 'TraceId', width: '200px' },
        { field: 'createTime', label: '时间', width: '200px' },
        { field: 'content', label: '内容' },
        {
          label: '操作',
          field: 'action',
          minWidth: '120px',
          slots: {
            default: (data) => {
              return (
                <el-button link type="primary" onClick={() => this.showDetail(data.row)}>
                  查看
                </el-button>
              )
            }
          }
        }
      ],
      searchParams: {
        type: [],
        createTime: [],
        traceId: ''
      }
    }
  },
  created() {
    this.tableUrl = getDeviceLogsUrl(this.deviceId)
  },
  mounted() {
    this.search()
  },
  methods: {
    search() {
      const params = []
      if (!_.isEmpty(this.searchParams.createTime)) {
        const formatDate = this.searchParams.createTime.map((e) =>
          dayjs(e).format('YYYY-MM-DD HH:mm:ss')
        )
        params.push({ key: 'createTime', oper: 'BTW', value: formatDate.join(',') })
      }
      if (!_.isEmpty(this.searchParams.type)) {
        params.push({ key: 'type', oper: 'IN', value: this.searchParams.type })
      }
      if (!_.isEmpty(this.searchParams.traceId)) {
        params.push({ key: 'traceId', value: _.trim(this.searchParams.traceId) })
      }
      this.$refs.tb.search(params)
    },
    resetSearch() {
      this.searchParams = {
        type: [],
        createTime: []
      }
      this.search()
    },
    showDetail(record) {
      let content = null
      try {
        content = JSON.stringify(JSON.parse(record.content), null, 2)
      } catch (error) {
        content = record.content
      }
      this.$confirm(<pre>{content}</pre>, {
        title: '详细信息'
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
