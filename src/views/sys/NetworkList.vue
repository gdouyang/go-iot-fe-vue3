<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="searchObj.name" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="端口">
              <a-input v-model="searchObj.port" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="状态">
              <a-select v-model="searchObj.state" :allowClear="true">
                <a-select-option value="runing">运行中</a-select-option>
                <a-select-option value="stop">停用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="网络类型">
              <a-select v-model="searchObj.type" :allowClear="true">
                <a-select-option value="MQTT_BROKER">MQTT_BROKER</a-select-option>
                <a-select-option value="TCP_SERVER">TCP_SERVER</a-select-option>
                <a-select-option value="HTTP_SERVER">HTTP_SERVER</a-select-option>
                <a-select-option value="WEBSOCKET_SERVER">WEBSOCKET_SERVER</a-select-option>
                <a-select-option value="MQTT_CLIENT">MQTT_CLIENT</a-select-option>
                <a-select-option value="TCP_CLIENT">TCP_CLIENT</a-select-option>
                <a-select-option value="MODBUS">MODBUS_TCP</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd" v-action:network-config:add
        >新建</a-button
      >
    </div>
    <PageTable ref="tb" size="default" :url="tableUrl" :columns="columns">
      <span slot="state" slot-scope="text">
        <a-tag color="#87d068" v-if="text === 'runing'">{{ text }}</a-tag>
        <a-tag color="#f50" v-else>{{ text }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="meters(record)">查看</a>
        <span v-action:network-config:save>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
        </span>
        <span v-if="!record.productId" v-action:network-config:delete>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？" @confirm="remove(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </span>
    </PageTable>
    <NetworkModal ref="modal" @ok="handleOk"></NetworkModal>
  </a-card>
</template>

<script>
import { tableUrl, removeNetwork } from './networkapi.js'
import NetworkModal from './modules/NetworkModal'
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
        { title: 'ID', dataIndex: 'id', width: '150px' },
        { title: '关联产品', dataIndex: 'productId' },
        { title: '网络类型', dataIndex: 'type' },
        { title: '端口', dataIndex: 'port' },
        { title: '状态', dataIndex: 'state', scopedSlots: { customRender: 'state' } },
        { title: '创建时间', dataIndex: 'createTime' },
        {
          title: '操作',
          minWidth: '210px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
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
    meters(row) {
      this.$http.get(`server/meters/${row.id}`).then((data) => {
        const content = JSON.stringify(data.result, null, 2)
        this.$confirm({
          width: '400px',
          title: '信息',
          content: (
            <div>
              <pre style="padding: 5px; background-color: #efefef;">{content}</pre>
            </div>
          ),
          okText: '确定',
          cancelText: '关闭'
        })
      })
    },
    handleAdd() {
      this.$refs.modal.add()
    },
    handleEdit(record) {
      this.$refs.modal.edit(record)
    },
    handleOk() {
      this.resetSearch()
    },
    remove(row) {
      removeNetwork(row.id).then((data) => {
        if (data.success) {
          this.$message.success('操作成功')
          this.search()
        }
      })
    }
  }
}
</script>
