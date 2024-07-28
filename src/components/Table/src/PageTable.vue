<script setup lang="ts">
import request from '@/axios'
import { PropType, defineExpose, ref, defineEmits, nextTick } from 'vue'
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

const getTableList = async (params?: any) => {
  const p = {
    pageNum: props.pageNum,
    pageSize: props.pageSize,
    condition: null
  }
  if (params) {
    p.condition = params
  }
  const res = await request.post(props.url, p).finally(() => {
    loading.value = false
  })
  if (res) {
    tableDataList.value = res.result.list
    total.value = res.result.totalPage
  }
}

const search = () => {
  getTableList()
}
const pageSizeChange = (val: number) => {
  emits('update:pageSize', val)
  nextTick(() => {
    getTableList()
  })
}
const pageNumChange = (val: number) => {
  emits('update:pageNum', val)
  nextTick(() => {
    getTableList()
  })
}

defineExpose({
  search: search
})
</script>

<template>
  <Table
    v-bind="$attrs"
    @update:pageSize="pageSizeChange"
    @update:currentPage="pageNumChange"
    :columns="columns"
    :data="tableDataList"
    :loading="loading"
    :pagination="{ total: total }"
  />
</template>

<style lang="less" scoped></style>
