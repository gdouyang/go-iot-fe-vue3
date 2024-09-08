<template>
  <div>
    <ContentWrap v-show="!isDetail">
      <div>
        <div class="table-page-search-wrapper">
          <el-form layout="inline">
            <el-row :gutter="48">
              <el-col :md="5" :sm="24">
                <el-form-item label="产品">
                  <el-select v-model="searchObj.productId" placeholder="产品" :allowClear="true">
                    <el-option
                      v-for="p in productList"
                      :key="p.id"
                      :value="p.id"
                      :label="p.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="设备ID">
                  <el-input v-model="searchObj.id" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="名称">
                  <el-input v-model="searchObj.name" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="状态">
                  <el-select v-model="searchObj.state" :allowClear="true">
                    <el-option value="noActive" label="未激活"></el-option>
                    <el-option value="offline" label="离线"></el-option>
                    <el-option value="online" label="在线"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="4" :sm="24">
                <span class="table-page-search-submitButtons">
                  <el-button type="primary" @click="search">查询</el-button>
                  <el-button style="margin-left: 8px" @click="resetSearch">重置</el-button>
                </span>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="table-operator">
          <el-button type="primary" @click="add" v-hasPermi="'device-mgr:add'"
            ><Icon icon="carbon:add-large" />新建</el-button
          >
          <el-button @click="showImport" v-hasPermi="'device-mgr:add'"
            ><Icon icon="carbon:cloud-upload" />批量导入设备</el-button
          >
          <el-button @click="batchDeploy" v-hasPermi="'device-mgr:save'">批量激活</el-button>
          <el-button @click="batchUndeploy" v-hasPermi="'device-mgr:save'">批量停用</el-button>
        </div>
        <PageTable
          ref="tb"
          :url="tableUrl"
          :columns="columns"
          rowKey="id"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
        </PageTable>
      </div>
    </ContentWrap>
    <DeviceAdd ref="DeviceAdd" @success="search()" />
    <DeviceImport ref="DeviceImport" @success="search()" />
    <DeviceDetail v-if="isDetail" ref="DeviceDetail" @back="back" />
    <Dialog
      ref="processModal"
      :showOk="false"
      @close="processModalClose"
      :width="500"
      title="进度"
      cancelText="关闭"
    >
      <el-badge status="success" text="已完成" v-if="isFinish" />
      <el-badge status="processing" text="进行中" v-else />
      <span style="margin-left: 15px">总数量:{{ count }}</span>
      <p style="color: red">{{ errMessage }}</p>
    </Dialog>
  </div>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import { pageUrl, batchDeploy, batchUndeploy, getProductList, getImportResultUrl } from './api.js'
import TableActions from './TableActions.vue'
import DeviceAdd from './modules/DeviceAdd.vue'
import DeviceImport from './modules/DeviceImport.vue'
import DeviceDetail from './DetailIndex.vue'

const defautSearchObj = {}
export default {
  components: {
    DeviceAdd,
    DeviceImport,
    DeviceDetail
  },
  data() {
    return {
      tableUrl: pageUrl,
      searchObj: _.cloneDeep(defautSearchObj),
      columns: [
        { label: '设备ID', field: 'id' },
        { label: '名称', field: 'name' },
        { label: '产品', field: 'productId' },
        {
          label: '设备类型',
          field: 'deviceType',
          slots: {
            default: (data) => {
              if (data.row.deviceType == 'device') {
                return <el-tag>设备</el-tag>
              } else if (data.row.deviceType == 'gateway') {
                return <el-tag>网关</el-tag>
              } else {
                return <el-tag>子设备</el-tag>
              }
            }
          }
        },
        {
          label: '状态',
          field: 'state',
          slots: {
            default: (data) => {
              if (data.row.state == 'online') {
                return <el-tag type="success">在线</el-tag>
              } else if (data.row.state == 'offline') {
                return <el-tag type="danger">离线</el-tag>
              } else {
                return <el-tag type="info">未激活</el-tag>
              }
            }
          }
        },
        { label: '创建时间', field: 'createTime' },
        { label: '说明', field: 'desc' },
        {
          label: '操作',
          field: 'action',
          width: '220px',
          slots: {
            default: (data) => {
              return (
                <TableActions
                  record={data.row}
                  onEdit={this.handleEdit}
                  onDetail={this.detail}
                  onOk={this.tableRefresh}
                />
              )
            }
          }
        }
      ],
      isDetail: false,
      selectedRowKeys: [],
      selectedRows: [],
      isFinish: false,
      count: 0,
      errMessage: '',
      productList: []
    }
  },
  mounted() {
    const deviceId = this.$route.query.id
    if (deviceId) {
      this.detail(deviceId)
    } else {
      this.search()
      getProductList().then((resp) => {
        if (resp.success) {
          this.productList = resp.result
        }
      })
    }
  },
  methods: {
    search() {
      const condition = []
      if (this.searchObj.id) {
        condition.push({ key: 'id', value: this.searchObj.id, oper: 'LIKE' })
      }
      if (this.searchObj.name) {
        condition.push({ key: 'name', value: this.searchObj.name, oper: 'LIKE' })
      }
      if (this.searchObj.state) {
        condition.push({ key: 'state', value: this.searchObj.state })
      }
      if (this.searchObj.productId) {
        condition.push({ key: 'productId', value: this.searchObj.productId })
      }
      this.$refs.tb.search(condition)
    },
    resetSearch() {
      this.searchObj = _.cloneDeep(defautSearchObj)
      this.search()
    },
    tableRefresh() {
      this.$refs.tb.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    add() {
      this.$refs.DeviceAdd.add()
    },
    detail(id) {
      this.$router.push({ name: this.$route.name, query: { id: id } }).then(() => {
        this.isDetail = true
      })
    },
    back() {
      this.$router.push({ name: this.$route.name, query: {} }).then(() => {
        this.isDetail = false
        this.tableRefresh()
      })
    },
    handleEdit(row) {
      this.$refs.DeviceAdd.edit(row)
    },
    showImport() {
      this.$refs.DeviceImport.open()
    },
    batchDeploy() {
      let msg = `确定要激活${_.size(this.selectedRowKeys)}个设备吗？`
      if (_.isEmpty(this.selectedRowKeys)) {
        msg = '确定要激活所有设备吗？'
      }
      this.$confirm(msg, {
        title: '确认'
      }).then(() => {
        batchDeploy(this.selectedRowKeys).then((resp) => {
          if (resp.success) {
            this.showProcessResult(resp.result)
          } else {
            this.$message.success(resp.message)
          }
        })
      })
    },
    batchUndeploy() {
      let msg = `确定要停用${_.size(this.selectedRowKeys)}个设备吗？`
      if (_.isEmpty(this.selectedRowKeys)) {
        msg = '确定要停用所有设备吗？'
      }
      this.$confirm(msg, {
        title: '确认'
      }).then(() => {
        batchUndeploy(this.selectedRowKeys).then((resp) => {
          if (resp.success) {
            this.showProcessResult(resp.result)
          } else {
            this.$message.success(resp.message)
          }
        })
      })
    },
    showProcessResult(token) {
      this.$refs.processModal.open()
      var source = new EventSource(getImportResultUrl(token))
      source.onmessage = (e) => {
        const res = JSON.parse(e.data)
        if (res.success) {
          const temp = res.result.num
          this.count = temp
          if (res.result.finish) {
            this.isFinish = true
            source.close()
            this.$message.success('操作成功')
          }
        } else {
          this.errMessage = res.message
        }
      }
      source.onerror = () => {
        source.close()
      }
      source.onopen = function (event) {}
    },
    processModalClose() {
      this.isFinish = false
      this.count = 0
      this.errMessage = null
      this.search()
    }
  }
}
</script>

<style lang="less" scoped></style>
