<template>
  <div>
    <ContentWrap v-show="!GetDetailStatus">
      <div>
        <div class="table-page-search-wrapper">
          <el-form layout="inline">
            <el-row :gutter="48">
              <el-col :md="5" :sm="24">
                <el-form-item label="产品">
                  <el-select v-model="searchObj.productId" placeholder="产品" :allowClear="true">
                    <el-option v-for="p in productList" :key="p.id" :value="p.id">{{
                      p.name
                    }}</el-option>
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
                    <el-option value="noActive">未激活</el-option>
                    <el-option value="offline">离线</el-option>
                    <el-option value="online">在线</el-option>
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
          <el-button type="primary" icon="plus" @click="add" v-action:device-mgr:add
            >新建</el-button
          >
          <el-button icon="upload" @click="showImport" v-action:device-mgr:add
            >批量导入设备</el-button
          >
          <el-button icon="link" @click="batchDeploy" v-action:device-mgr:save>批量激活</el-button>
          <el-button icon="disconnect" @click="batchUndeploy" v-action:device-mgr:save
            >批量停用</el-button
          >
        </div>
        <PageTable
          ref="tb"
          :url="tableUrl"
          :columns="columns"
          rowKey="id"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <span slot="deviceType" slot-scope="text">
            <span v-if="text == 'device'">设备</span>
            <span v-else-if="text == 'gateway'">网关</span>
            <span v-else>子设备</span>
          </span>
          <span slot="state" slot-scope="text">
            <el-tag color="#87d068" v-if="text == 'online'">{{ text }}</el-tag>
            <el-tag color="#f50" v-else-if="text == 'offline'">{{ text }}</el-tag>
            <el-tag color="gray" v-else>{{ text }}</el-tag>
          </span>
          <span slot="createTime" slot-scope="text, record">
            {{ $moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
          <span slot="action" slot-scope="text, record">
            <a size="small" @click="detail(record.id)">查看</a>
            <span v-action:device-mgr:save>
              <el-divider direction="vertical" />
              <a size="small" @click="edit(record)">修改</a>
            </span>
            <span v-action:device-mgr:save>
              <el-divider direction="vertical" />
              <a size="small" @click="deploy(record.id)" v-if="record.state === 'noActive'">激活</a>
              <el-popconfirm v-else title="确认停用？" @confirm="unDeploy(record.id)">
                <a>停用</a>
              </el-popconfirm>
            </span>
            <span v-if="record.state === 'noActive'" v-action:device-mgr:delete>
              <el-divider direction="vertical" />
              <el-popconfirm title="确认删除？" @confirm="remove(record)">
                <a>删除</a>
              </el-popconfirm>
            </span>
          </span>
        </PageTable>
      </div>
    </ContentWrap>
    <DeviceAdd ref="DeviceAdd" @success="search()" />
    <DeviceImport ref="DeviceImport" @success="search()" />
    <DeviceDetail ref="DeviceDetail" v-if="GetDetailStatus" @back="back" />
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
import {
  pageUrl,
  remove,
  undeploy,
  deploy,
  batchDeploy,
  batchUndeploy,
  getProductList,
  getImportResultUrl
} from '@/views/iot/device/api.js'
import DeviceAdd from './modules/DeviceAdd.vue'
import DeviceImport from './modules/DeviceImport.vue'
import DeviceDetail from './editor/Index.vue'

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
        { label: '设备类型', field: 'deviceType', scopedSlots: { customRender: 'deviceType' } },
        { label: '状态', field: 'state', scopedSlots: { customRender: 'state' } },
        { label: '创建时间', field: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { label: '说明', field: 'desc' },
        { label: '操作', field: 'action', minWidth: 210, scopedSlots: { customRender: 'action' } }
      ],
      GetDetailStatus: false,
      selectedRowKeys: [],
      selectedRows: [],
      isFinish: false,
      count: 0,
      errMessage: '',
      productList: []
    }
  },
  created() {
    this.$nextTick(() => {
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
    })
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    add() {
      this.$refs.DeviceAdd.add()
    },
    detail(id) {
      this.$router.push({ name: this.$route.name, query: { id: id } })
      this.GetDetailStatus = true
    },
    back() {
      this.$router.push({ name: this.$route.name, query: {} })
      this.GetDetailStatus = false
      this.search()
    },
    edit(row) {
      this.$refs.DeviceAdd.edit(row)
    },
    deploy(id) {
      deploy(id).then((data) => {
        if (data.success) {
          this.$message.success('操作成功')
          this.search()
        }
      })
    },
    unDeploy(id) {
      undeploy(id).then((data) => {
        if (data.success) {
          this.$message.success('操作成功')
          this.search()
        }
      })
    },
    remove(row) {
      remove(row.id).then((data) => {
        if (data.success) {
          this.$message.success('操作成功')
          this.search()
        }
      })
    },
    showImport() {
      this.$refs.DeviceImport.open()
    },
    batchDeploy() {
      let msg = `确定要激活${_.size(this.selectedRowKeys)}个设备吗？`
      if (_.isEmpty(this.selectedRowKeys)) {
        msg = '确定要激活所有设备吗？'
      }
      this.$confirm({
        title: '确认',
        content: msg,
        onOk: () => {
          batchDeploy(this.selectedRowKeys).then((resp) => {
            if (resp.success) {
              this.showProcessResult(resp.result)
            } else {
              this.$message.success(resp.message)
            }
          })
        }
      })
    },
    batchUndeploy() {
      let msg = `确定要停用${_.size(this.selectedRowKeys)}个设备吗？`
      if (_.isEmpty(this.selectedRowKeys)) {
        msg = '确定要停用所有设备吗？'
      }
      this.$confirm({
        title: '确认',
        content: msg,
        onOk: () => {
          batchUndeploy(this.selectedRowKeys).then((resp) => {
            if (resp.success) {
              this.showProcessResult(resp.result)
            } else {
              this.$message.success(resp.message)
            }
          })
        }
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
