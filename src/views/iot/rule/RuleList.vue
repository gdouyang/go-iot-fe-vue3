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
            <el-form-item label="状态">
              <el-select v-model="searchObj.state" :allowClear="true">
                <el-option value="stopped">停止</el-option>
                <el-option value="started">启动</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button style="margin-left: 8px" @click="resetSearch">重置</el-button>
            </span>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="table-operator">
      <el-button type="primary" icon="plus" @click="handleAdd" v-action:rule-mgr:add
        >新建</el-button
      >
    </div>

    <PageTable ref="tb" :url="url" :columns="columns">
      <span slot="state" slot-scope="text">
        <el-tag color="#87d068" v-if="text === 'started'">{{ text }}</el-tag>
        <el-tag color="#f50" v-else>{{ text }}</el-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="edit(record)">编辑</a>
        <span v-action:rule-mgr:add>
          <el-divider direction="vertical" />
          <el-popconfirm title="确认复制？" @confirm="copy(record)">
            <a>复制</a>
          </el-popconfirm>
        </span>
        <el-divider direction="vertical" />
        <span v-if="record.state === 'stopped'">
          <el-popconfirm title="确认启动？" @confirm="start(record)" v-action:rule-mgr:save>
            <a>启动</a>
          </el-popconfirm>
          <span v-action:rule-mgr:delete>
            <el-divider direction="vertical" />
            <el-popconfirm title="确认删除？" @confirm="deleteScene(record.id)">
              <a>删除</a>
            </el-popconfirm>
          </span>
        </span>
        <el-popconfirm v-else title="确认停止？" @confirm="stop(record)" v-action:rule-mgr:save>
          <a>停止</a>
        </el-popconfirm>
      </span>
    </PageTable>

    <RuleAdd
      ref="modal"
      v-if="openModal"
      :data="currentData"
      @success="handleOk"
      @close="openModal = false"
    ></RuleAdd>
  </ContentWrap>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import { tableUrl, get, remove, start, stop, copy } from './api.js'
import RuleAdd from './modules/RuleAdd.vue'

export default {
  name: 'SceneList',
  components: {
    RuleAdd
  },
  data() {
    return {
      url: tableUrl,
      // 查询参数
      searchObj: {},
      // 表头
      columns: [
        { label: 'ID', field: 'id', width: 210 },
        { label: '名称', field: 'name' },
        { label: '状态', field: 'state', width: 180, scopedSlots: { customRender: 'state' } },
        { label: '创建时间', field: 'createTime' },
        { label: '操作', minWidth: 210, field: 'action', scopedSlots: { customRender: 'action' } }
      ],
      openModal: false,
      currentData: {}
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
      if (this.searchObj.state) {
        condition.push({ key: 'state', value: this.searchObj.state })
      }
      this.$refs.tb.search(condition)
    },
    resetSearch() {
      this.searchObj = {}
      this.search()
    },
    handleAdd() {
      this.currentData = {}
      this.openModal = true
    },
    edit(record) {
      get(record.id).then((resp) => {
        if (resp.success) {
          this.currentData = _.cloneDeep(resp.result)
          this.openModal = true
        }
      })
    },
    handleOk() {
      this.openModal = false
      // 新增/修改 成功时，重载列表
      this.search()
    },
    start(item) {
      this.spinning = true
      start(item.id).then((resp) => {
        if (resp.success) {
          this.$message.success('启动成功')
          this.search()
        } else {
          this.spinning = false
        }
      })
    },
    deleteScene(id) {
      this.spinning = true
      remove(id).then((response) => {
        if (response.success) {
          this.$message.success('操作成功')
          this.search()
        } else {
          this.spinning = false
        }
      })
    },
    stop(item) {
      this.spinning = true
      stop(item.id).then((response) => {
        if (response.success) {
          this.$message.success('停止成功')
          this.search()
        } else {
          this.spinning = false
        }
      })
    },
    copy(item) {
      copy(item.id).then((data) => {
        if (data.success) {
          this.$message.success('操作成功')
          this.handleOk()
        }
      })
    }
  }
}
</script>
