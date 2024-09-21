<script setup lang="ts">
import _ from 'lodash-es'
import request from '@/axios'
import { PropType, ref } from 'vue'
import Table from './Table.vue'
import type { TableColumn } from './types'
const props = defineProps({
  url: {
    type: String,
    default: () => ''
  },
  // 表头
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => []
  },
  pageNum: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  }
})
const emits = defineEmits(['update:pageNum', 'update:pageSize'])
const loading = ref(true)
const total = ref(0)

const tableDataList = ref<[]>([])
const cache = {
  searchAfterList: [],
  searchAfter: null,
  currentSearchAfter: null,
  pageNum: props.pageNum,
  pageSize: props.pageSize,
  condition: null
}

const getTableList = async (pageNum: number, pageSize: number, params?: any) => {
  const p = {
    pageNum: pageNum,
    pageSize: pageSize,
    searchAfter: null,
    condition: null
  }
  if (p.pageNum === 1 || (cache.pageSize && pageSize !== cache.pageSize)) {
    p.searchAfter = null
    cache.searchAfterList = []
  } else if (cache.searchAfter) {
    if (pageNum < cache.pageNum) {
      cache.searchAfterList = _.dropRight(cache.searchAfterList, 2)
      cache.searchAfter = _.last(cache.searchAfterList)
    }
    p.searchAfter = cache.searchAfter
  }
  cache.currentSearchAfter = p.searchAfter
  if (params) {
    p.condition = params
    cache.condition = params
  }
  cache.pageNum = pageNum
  cache.pageSize = pageSize
  loading.value = true
  const res = await request.post(props.url, p).finally(() => {
    loading.value = false
  })
  if (res) {
    tableDataList.value = res.result.list
    total.value = res.result.totalCount
    const r = res.result
    if (r.searchAfter && !_.isEmpty(r.searchAfter)) {
      cache.searchAfterList.push(r.searchAfter)
      cache.searchAfter = r.searchAfter
    }
  }
}

const search = (params?: any) => {
  getTableList(props.pageNum, props.pageSize, params)
}
const refresh = async () => {
  const p = {
    pageNum: cache.pageNum,
    pageSize: cache.pageSize,
    searchAfter: cache.currentSearchAfter,
    condition: cache.condition
  }
  loading.value = true
  const res = await request.post(props.url, p).finally(() => {
    loading.value = false
  })
  if (res) {
    tableDataList.value = res.result.list
    total.value = res.result.totalCount
  }
}
const pageSizeChange = (val: number) => {
  emits('update:pageSize', val)
  getTableList(1, val)
}
const pageNumChange = (val: number) => {
  emits('update:pageNum', val)
  getTableList(val, props.pageSize)
}

defineExpose({
  search: search,
  refresh: refresh
})
</script>

<template>
  <Table
    v-bind="$attrs"
    :pageSize="pageSize"
    :currentPage="pageNum"
    :columns="columns"
    :data="tableDataList"
    :loading="loading"
    :pagination="{
      total: total,
      layout: 'sizes, prev, next, total',
      prevText: '上一页',
      nextText: '下一页'
    }"
    @update:pageSize="pageSizeChange"
    @update:currentPage="pageNumChange"
  />
</template>

<style lang="less" scoped>
:deep(.el-pagination) {
  justify-content: flex-end;
}
</style>
