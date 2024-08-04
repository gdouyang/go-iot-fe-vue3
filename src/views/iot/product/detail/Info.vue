<template>
  <div>
    <ContentWrap>
      <el-descriptions border :column="2">
        <template #title>
          产品信息
          <el-button link type="primary" @click="openBasicInfo">编辑</el-button>
        </template>
        <el-descriptions-item label="产品ID" :span="1">{{ data.id }}</el-descriptions-item>
        <el-descriptions-item label="网络类型" :span="1">{{
          data.networkType
        }}</el-descriptions-item>
        <el-descriptions-item label="说明" :span="2">{{ data.desc }}</el-descriptions-item>
      </el-descriptions>

      <Network v-if="data.id" :product="data"></Network>

      <Configuration :productId="data.id" :configuration="configuration" @refresh="refresh()" />
    </ContentWrap>

    <ProductAdd v-if="addVisible" ref="ProductAdd" @success="refresh()" />
  </div>
</template>

<script lang="jsx">
// import dayjs from 'dayjs'
// import _ from 'lodash-es'
import ProductAdd from '../modules/ProductAdd.vue'
import Configuration from './Configuration.vue'
import Network from './Network.vue'

export default {
  name: 'ProductInfo',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ProductAdd,
    Configuration,
    Network
  },
  data() {
    return {
      configuration: [],
      addVisible: false
    }
  },
  created() {
    this.GetData()
  },
  computed: {},
  watch: {
    'data.metaconfig'(newVal) {
      this.GetData()
    }
  },
  methods: {
    GetData() {
      const data = this.data
      this.configuration = data.metaconfig ? data.metaconfig : []
    },
    openBasicInfo() {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.ProductAdd.edit(this.data)
      })
    },
    refresh() {
      this.$emit('refresh')
      this.GetData()
    }
  }
}
</script>

<style lang="less" scoped></style>
