<template>
  <Dialog
    ref="dialog"
    title="选择设备"
    @confirm="submitData"
    @close="addClose"
    width="70%"
    :footer="null"
  >
    <div>
      <div class="table-page-search-wrapper">
        <el-form layout="inline">
          <el-row :gutter="48">
            <el-col :md="8" :sm="24">
              <el-form-item label="编号">
                <el-input v-model="searchObj.id" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="名称">
                <el-input v-model="searchObj.name" placeholder="请输入" />
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
      <PageTable ref="tb" :url="url" :columns="columns" rowKey="id"> </PageTable>
    </div>
  </Dialog>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import { pageUrl } from '@/views/iot/device/api.js'
const defautSearchObj = {
  code: '',
  name: ''
}
export default {
  components: {},
  props: {
    productId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      url: pageUrl,
      searchObj: _.cloneDeep(defautSearchObj),
      columns: [
        { label: '编码', field: 'id' },
        { label: '名称', field: 'name' },
        { label: '产品', field: 'productId' },
        { label: '状态', field: 'state' },
        {
          label: '操作',
          field: 'action',
          minWidth: '120px',
          slots: {
            default: (data) => {
              return (
                <el-button link type="primary" onClick={() => this.select(data.row)}>
                  选择
                </el-button>
              )
            }
          }
        }
      ]
    }
  },
  created() {},
  methods: {
    search() {
      const condition = []
      if (this.searchObj.id) {
        condition.push({ key: 'id', value: this.searchObj.id, oper: 'LIKE' })
      }
      if (this.searchObj.name) {
        condition.push({ key: 'name', value: this.searchObj.name, oper: 'LIKE' })
      }
      condition.push({ key: 'productId', value: this.productId })
      this.$refs.tb.search(condition)
    },
    resetSearch() {
      this.searchObj = _.cloneDeep(defautSearchObj)
      this.search()
    },
    select(item) {
      this.$emit('select', item)
      this.$refs.dialog.close()
    },
    open() {
      this.$refs.dialog.open()
      this.$nextTick(() => {
        this.search()
      })
    },
    submitData() {},
    addClose() {}
  }
}
</script>

<style lang="less" scoped></style>
