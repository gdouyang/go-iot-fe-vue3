<template>
  <ContentWrap>
    <div class="table-page-search-wrapper">
      <el-form layout="inline">
        <el-row :gutter="48">
          <el-col :md="5" :sm="24">
            <el-form-item label="名称">
              <el-input v-model="searchObj.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :md="5" :sm="24">
            <el-form-item label="端口">
              <el-input v-model="searchObj.port" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :md="5" :sm="24">
            <el-form-item label="状态">
              <el-select v-model="searchObj.state" :allowClear="true">
                <el-option value="runing" label="运行中"></el-option>
                <el-option value="stop" label="停用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="5" :sm="24">
            <el-form-item label="网络类型">
              <el-select v-model="searchObj.type" :allowClear="true">
                <el-option value="MQTT_BROKER" label="MQTT_BROKER"></el-option>
                <el-option value="TCP_SERVER" label="TCP_SERVER"></el-option>
                <el-option value="HTTP_SERVER" label="HTTP_SERVER"></el-option>
                <el-option value="WEBSOCKET_SERVER" label="WEBSOCKET_SERVER"></el-option>
                <el-option value="MQTT_CLIENT" label="MQTT_CLIENT"></el-option>
                <el-option value="TCP_CLIENT" label="TCP_CLIENT"></el-option>
                <el-option value="MODBUS" label="MODBUS_TCP"></el-option>
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
      <el-button type="primary" @click="handleAdd" v-hasPermi="'network-config:add'"
        ><Icon icon="carbon:add-large" />新建</el-button
      >
    </div>
    <PageTable ref="tb" size="default" :url="tableUrl" :columns="columns"> </PageTable>
    <NetworkModal ref="modal" @ok="handleOk"></NetworkModal>
  </ContentWrap>
</template>

<script lang="jsx">
import { tableUrl, removeNetwork } from './networkapi.js'
import NetworkModal from './modules/NetworkModal.vue'
import NetworkActions from './modules/NetworkActions.vue'
export default {
  name: 'NetworkList',
  components: {
    NetworkModal
  },
  data() {
    return {
      tableUrl: tableUrl,
      // 查询参数
      searchObj: {},
      // 表头
      columns: [
        { label: 'ID', field: 'id', width: '150px' },
        { label: '关联产品', field: 'productId' },
        { label: '网络类型', field: 'type' },
        { label: '端口', field: 'port' },
        {
          label: '状态',
          field: 'state',
          slots: {
            default: (data) => {
              if (data.row.state === 'runing') {
                return <el-tag type="success">运行中</el-tag>
              } else {
                return <el-tag type="info">停止</el-tag>
              }
            }
          }
        },
        { label: '创建时间', field: 'createTime' },
        {
          label: '操作',
          minWidth: '110px',
          field: 'action',
          slots: {
            default: (data) => {
              return (
                <NetworkActions record={data.row} onEdit={this.handleEdit} onOk={this.handleOk} />
              )
            }
          }
        }
      ]
    }
  },
  computed: {},
  mounted() {
    this.search()
  },
  methods: {
    search() {
      const condition = []
      if (this.searchObj.port) {
        condition.push({ key: 'port', value: this.searchObj.port })
      }
      if (this.searchObj.state) {
        condition.push({ key: 'state', value: this.searchObj.state })
      }
      if (this.searchObj.type) {
        condition.push({ key: 'type', value: this.searchObj.type })
      }
      if (this.searchObj.name) {
        condition.push({ key: 'name', value: this.searchObj.name, oper: 'LIKE' })
      }
      this.$refs.tb.search(condition)
    },
    resetSearch() {
      this.searchObj = {}
      this.search()
    },
    handleAdd() {
      this.$refs.modal.add()
    },
    handleEdit(record) {
      this.$refs.modal.edit(record)
    },
    handleOk() {
      this.resetSearch()
    }
  }
}
</script>
