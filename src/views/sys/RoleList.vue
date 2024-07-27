<template>
  <ContentWrap title="角色管理">
    <div class="table-page-search-wrapper">
      <el-form layout="inline">
        <el-row :gutter="48">
          <el-col :md="5" :sm="24">
            <el-form-item label="名称">
              <el-input v-model="searchObj.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :md="5" :sm="24">
            <span class="table-page-search-submitButtons">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button style="margin-left: 8px" @click="resetSearch">重置</el-button>
            </span>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="table-operator">
      <el-button type="primary" icon="plus" @click="handleAdd" v-action:role-mgr:add
        >新建</el-button
      >
    </div>

    <PageTable ref="tb" :url="url" :columns="columns">
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-action:role-mgr:save>编辑</a>
        <span v-action:role-mgr:delete>
          <el-divider type="vertical" />
          <el-popconfirm title="确认删除？" @confirm="remove(record)">
            <a>删除</a>
          </el-popconfirm>
        </span>
      </span>
    </PageTable>

    <role-modal ref="modal" @ok="handleOk" />
  </ContentWrap>
</template>

<script>
import { ContentWrap } from '@/components/ContentWrap'
import { roleTableUrl, removeRole } from './api.js'
import RoleModal from './modules/RoleModal.vue'

export default {
  name: 'RoleList',
  components: {
    RoleModal
  },
  data() {
    return {
      url: roleTableUrl,
      // 查询参数
      searchObj: {},
      // 表头
      columns: [
        { title: 'ID', dataIndex: 'id', width: '150px' },
        { title: '角色名称', dataIndex: 'name' },
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
  mounted() {
    this.search()
  },
  methods: {
    search() {
      const condition = []
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
      // 新增/修改 成功时，重载列表
      this.search()
    },
    remove(row) {
      removeRole(row.id).then((data) => {
        if (data.success) {
          this.$message.success('操作成功')
          this.handleOk()
        }
      })
    }
  }
}
</script>
