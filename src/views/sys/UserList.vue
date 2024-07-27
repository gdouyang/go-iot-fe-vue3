<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="账号">
              <a-input v-model="searchObj.username" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="searchObj.nickname" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd" v-action:user-mgr:add>新建</a-button>
    </div>

    <PageTable ref="tb" :url="url" :columns="columns">
      <span slot="enableFlag" slot-scope="text, record">
        <a-tag color="#87d068" v-if="record.enableFlag">启用</a-tag>
        <a-tag color="#f50" v-else>禁用</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-action:user-mgr:save>编辑</a>
        <span v-action:user-mgr:save>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确认启用？"
            v-if="record.enableFlag === false"
            @confirm="enable(record)"
          >
            <a>启用</a>
          </a-popconfirm>
          <a-popconfirm title="确认禁用？" v-else @confirm="disable(record)">
            <a>禁用</a>
          </a-popconfirm>
        </span>
        <span v-action:user-mgr:delete>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？" @confirm="remove(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </span>
    </PageTable>

    <user-modal ref="modal" @ok="handleOk" :showTanent="showTanent"></user-modal>
  </a-card>
</template>

<script>
import { userTableUrl, enableUser, disableUser, removeUser } from './api.js'
import UserModal from './modules/UserModal'

export default {
  name: 'UserList',
  components: {
    UserModal
  },
  data() {
    return {
      url: userTableUrl,
      showTanent: false,
      // 查询参数
      searchObj: {},
      // 表头
      columns: [
        { title: 'ID', dataIndex: 'id', width: '150px' },
        { title: '账号', dataIndex: 'username' },
        { title: '名称', dataIndex: 'nickname' },
        { title: '状态', dataIndex: 'enableFlag', scopedSlots: { customRender: 'enableFlag' } },
        { title: '描述', dataIndex: 'desc' },
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
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    search() {
      const condition = []
      if (this.searchObj.username) {
        condition.push({ key: 'username', value: this.searchObj.username, oper: 'LIKE' })
      }
      if (this.searchObj.nickname) {
        condition.push({ key: 'nickname', value: this.searchObj.nickname, oper: 'LIKE' })
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
      // 新增/修改 成功时，重载列表
      this.search()
    },
    enable(row) {
      enableUser(row.id).then((data) => {
        if (data.success) {
          this.$message.success('操作成功')
          this.handleOk()
        }
      })
    },
    disable(row) {
      disableUser(row.id).then((data) => {
        if (data.success) {
          this.$message.success('操作成功')
          this.handleOk()
        }
      })
    },
    remove(row) {
      const _this = this
      removeUser(row.id).then((data) => {
        if (data.success) {
          _this.$message.success('操作成功')
          _this.handleOk()
        }
      })
    }
  }
}
</script>
