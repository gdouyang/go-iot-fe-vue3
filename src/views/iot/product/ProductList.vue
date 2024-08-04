<template>
  <div>
    <ContentWrap v-show="!isEdit">
      <div>
        <div class="table-page-search-wrapper">
          <el-form layout="inline">
            <el-row :gutter="48">
              <el-col :md="5" :sm="24">
                <el-form-item label="产品ID">
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
                    <el-option value="true" label="发布"></el-option>
                    <el-option value="false" label="停用"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="6" :sm="24">
                <span class="table-page-search-submitButtons">
                  <el-button type="primary" @click="search">查询</el-button>
                  <el-button style="margin-left: 8px" @click="resetSearch">重置</el-button>
                </span>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="table-operator">
          <el-button type="primary" @click="add" v-action:product-mgr:add>新建</el-button>
          <el-upload
            style="display: inline"
            name="file"
            v-action:product-mgr:add
            accept=".json"
            :multiple="false"
            :show-file-list="false"
            :with-credentials="true"
            :before-upload="beforeUpload"
          >
            <el-button>导入</el-button>
          </el-upload>
        </div>
        <PageTable ref="tb" :url="tableUrl" :columns="columns" rowKey="id"> </PageTable>
      </div>
    </ContentWrap>
    <ProductAdd ref="ProductAdd" @success="search()" />
    <Detail v-if="isEdit" ref="Detail" @back="back" />
  </div>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import { tableUrl, uploadProduct } from './api.js'
import TableActions from './TableActions.vue'
import ProductAdd from './modules/ProductAdd.vue'
import Detail from './DetailIndex.vue'

const defautSearchObj = {
  name: ''
}
export default {
  mixins: [],
  components: {
    ProductAdd,
    Detail
  },
  data() {
    return {
      tableUrl: tableUrl,
      searchObj: _.cloneDeep(defautSearchObj),
      columns: [
        { label: '产品ID', field: 'id' },
        { label: '名称', field: 'name' },
        {
          label: '状态',
          field: 'state',
          slots: {
            default: (data) => {
              if (data.row.state) {
                return <el-tag type="success">发布</el-tag>
              } else {
                return <el-tag type="info">停用</el-tag>
              }
            }
          }
        },
        { label: '创建时间', field: 'createTime' },
        { label: '说明', field: 'desc' },
        {
          label: '操作',
          minWidth: '110px',
          field: 'action',
          slots: {
            default: (data) => {
              return (
                <TableActions record={data.row} onEdit={this.handleEdit} onOk={this.handleOk} />
              )
            }
          }
        }
      ],
      isEdit: false
    }
  },
  mounted() {
    const deviceId = this.$route.query.id
    if (deviceId) {
      this.handleEdit(deviceId)
    } else {
      this.search()
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
      this.$refs.tb.search(condition)
    },
    resetSearch() {
      this.searchObj = _.cloneDeep(defautSearchObj)
      this.search()
    },
    add() {
      this.$refs.ProductAdd.add()
    },
    handleOk() {
      this.search()
    },
    handleEdit(id) {
      this.$router.push({ name: this.$route.name, query: { id: id } }).then(() => {
        this.isEdit = true
      })
    },
    back() {
      this.$router.push({ name: this.$route.name, query: {} }).then(() => {
        this.isEdit = false
        this.search()
      })
    },
    beforeUpload(file) {
      uploadProduct(file).then((resp) => {
        if (resp.success) {
          this.$message.success('操作成功')
          this.handleOk()
        } else {
          this.$message.success(resp.message)
        }
      })
      return false
    }
  }
}
</script>

<style lang="less" scoped></style>
