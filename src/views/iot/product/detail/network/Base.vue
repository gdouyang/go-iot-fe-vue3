<template>
  <div></div>
</template>

<script lang="jsx">
import _ from 'lodash-es'
import { getNetwork, updateNetwork } from '@/views/iot/product/api.js'
import NetworkRun from './NetworkRun.vue'
import CertificateUpload from './upload.vue'

export default {
  name: 'NetworConfig',
  props: {},
  components: {
    NetworkRun,
    CertificateUpload
  },
  data() {
    return {
      accessIp: null
    }
  },
  created() {
    const sysConfig = this.$store.getters.sysConfig
    if (sysConfig && sysConfig.accessIp) {
      this.accessIp = sysConfig.accessIp
    } else {
      this.accessIp = '127.0.0.1'
    }
  },
  computed: {
    accessAddress() {
      const port = _.get(this.data, 'port', '')
      if (!port) {
        return ''
      }
      return this.accessIp + ':' + port
    }
  },
  methods: {
    convertConfiguration(source, dest) {
      if (source.configuration) {
        source.configuration = JSON.parse(source.configuration)
      } else {
        source.configuration = dest.configuration
      }
    },
    getNetwork(productId, defaultValue) {
      if (!productId) {
        this.$message.error('请指定产品ID')
        return Promise.reject(new Error('请指定产品ID'))
      }
      return getNetwork(productId).then((data) => {
        var result = null
        if (data.result) {
          this.convertConfiguration(data.result, defaultValue)
          result = data.result
        } else {
          result = _.cloneDeep(defaultValue)
        }
        return result
      })
    },
    updateNetwork(saveData) {
      if (!saveData.configuration.useTLS) {
        saveData.configuration.certificate = null
      }
      saveData.configuration = JSON.stringify(saveData.configuration)
      return updateNetwork(saveData).then((resp) => {
        return resp
      })
    }
  }
}
</script>
