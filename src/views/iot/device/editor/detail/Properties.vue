<template>
  <div>
    <ContentWrap>
      <div>
        <el-form label-width="auto">
          <el-row :gutter="{ md: 8, lg: 4, xl: 48 }">
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
import { getDevicePropertysUrl } from '@/views/iot/device/api.js'
export default {
  name: 'Properties',
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
      }
    }
  },
  created() {
    this.tableUrl = getDevicePropertysUrl(this.device.id)
  },
  mounted() {
    const metadata = JSON.parse(this.device.metadata)
    const properties = _.cloneDeep(metadata.properties)
    const columns = []
    _.forEach(properties, (prop) => {
      columns.push({ field: prop.id, label: prop.name })
    })
    columns.push({ field: 'createTime', label: '时间', minWidth: '120px' })
    this.columns = columns
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
