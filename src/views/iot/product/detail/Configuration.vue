<template>
  <div style="width: 100%; margin-top: 10px">
    <el-descriptions :style="{ marginBottom: 20 }" size="small">
      <span slot="title">
        配置
        <el-button icon="plus" :style="{ marginLeft: 20 }" type="link" @click="addConfig"
          >添加</el-button
        >
      </span>
    </el-descriptions>

    <div :style="{ marginBottom: '20px' }">
      <el-descriptions border :column="2" title="" size="small">
        <el-descriptions-item v-for="(item, index) in configuration" :key="index">
          <template #label>
            <el-tooltip :content="item.desc">
              <span>
                {{ item.property }}
              </span>
            </el-tooltip>
            <BaseButton :style="{ marginLeft: 20 }" @click="modifyConfig(item)"
              ><Icon icon="vi-ep:refresh"
            /></BaseButton>
            <el-popconfirm
              title="确认删除配置？"
              v-if="!item.buildin"
              @confirm="deleteConfig(item)"
            >
              <el-button icon="delete" :style="{ marginLeft: 20 }" type="link"></el-button>
            </el-popconfirm>
          </template>
          <span v-if="item.type == 'password' && item.value">••••••</span>
          <span v-else>{{ item.value }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <ConfigurationAdd
      v-if="updateVisibleAdd"
      :productId="productId"
      :all-config="configuration"
      :data="currentConfig"
      @close="
        () => {
          updateVisibleAdd = false
          refresh()
        }
      "
    />
  </div>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import { updateProduct } from '@/views/iot/product/api.js'
import ConfigurationAdd from './ConfigurationAdd.vue'
export default {
  name: 'Configuration',
  props: {
    productId: {
      type: String,
      default: () => null
    },
    configuration: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ConfigurationAdd
  },
  data() {
    return {
      updateVisibleAdd: false,
      currentConfig: null
    }
  },
  methods: {
    refresh() {
      this.$emit('refresh')
    },
    addConfig() {
      this.currentConfig = null
      this.updateVisibleAdd = true
    },
    modifyConfig(data) {
      this.currentConfig = data
      this.updateVisibleAdd = true
    },
    deleteConfig(data) {
      const conf = _.filter(this.configuration, (p) => p.property !== data.property)
      const param = {
        id: this.productId,
        metaconfig: conf
      }
      updateProduct(this.productId, param).then((resp) => {
        if (resp.success) {
          this.$message.success('操作成功')
          this.refresh()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
