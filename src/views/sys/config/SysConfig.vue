<template>
  <div class="page-header-index-wide">
    <a-card
      :bordered="false"
      :bodyStyle="{ padding: '16px 0', height: '100%' }"
      :style="{ height: '100%' }"
    >
      <div class="account-settings-info-main" :class="{ mobile: isMobile }">
        <div class="account-settings-info-left">
          <a-menu
            :mode="isMobile ? 'horizontal' : 'inline'"
            :style="{ border: '0', width: isMobile ? '560px' : 'auto' }"
            :selectedKeys="selectedKeys"
            type="inner"
          >
            <a-menu-item key="basic"> 系统配置 </a-menu-item>
          </a-menu>
        </div>
        <div class="account-settings-info-right">
          <div class="account-settings-info-title">
            <span>系统配置</span>
          </div>
          <div class="account-settings-info-view">
            <a-row :gutter="16" type="flex" justify="center">
              <a-col :order="isMobile ? 2 : 1" :md="24" :lg="16">
                <a-form-model layout="vertical" ref="form" :model="mdl">
                  <a-form-model-item
                    label="系统名称"
                    prop="title"
                    :rules="[{ required: true, message: '请输入系统名称' }]"
                  >
                    <a-input v-model="mdl.title" :maxLength="8" />
                  </a-form-model-item>

                  <a-form-model-item label="简介">
                    <a-input v-model="mdl.desc" :maxLength="30" />
                  </a-form-model-item>

                  <a-form-model-item label="默认位置">
                    <a-input v-model="defaultLocation" :disabled="true">
                      <a-button
                        slot="addonAfter"
                        @click="openLocation"
                        type="link"
                        icon="setting"
                        style="width: auto; height: auto"
                      ></a-button>
                    </a-input>
                  </a-form-model-item>

                  <a-form-model-item label="接入IP">
                    <a-input v-model="mdl.accessIp" :max-length="128"> </a-input>
                  </a-form-model-item>

                  <a-form-model-item>
                    <a-button type="primary" @click="saveBasic">更新</a-button>
                  </a-form-model-item>
                </a-form-model>
              </a-col>
              <a-col :order="1" :md="24" :lg="8" :style="{ minHeight: '180px' }">
                <div>
                  <img :src="img" style="width: 100px" />
                </div>
                <a-upload
                  name="file"
                  :multiple="false"
                  action="api/file/upload"
                  @change="handleChange"
                  :showUploadList="false"
                  :withCredentials="true"
                >
                  <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                </a-upload>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </a-card>
    <LocationConfig ref="LocationConfig" @success="selectLocation" />
  </div>
</template>

<script>
import _ from 'lodash'
import store from '@/store'
import { RouteView } from '@/layouts'
import { baseMixin } from '@/store/app-mixin'
// import LocationConfig from '@/components/tools/LocationConfig.vue'

export default {
  name: 'SysConfig',
  components: {
    RouteView
    // LocationConfig
  },
  mixins: [baseMixin],
  data() {
    return {
      mdl: {
        title: undefined,
        desc: undefined,
        img: undefined,
        defaultLocation: {
          longitude: 0,
          latitude: 0
        },
        accessIp: null
      },
      mode: 'inline',

      openKeys: [],
      selectedKeys: ['basic']
    }
  },
  computed: {
    sysConfig() {
      return this.$store.getters.sysConfig
    },
    img() {
      // if (_.startsWith(this.mdl.img, 'api')) {
      //   return this.mdl.img
      // }
      // return 'api/' + this.mdl.img
      return this.mdl.img
    },
    defaultLocation() {
      const l = this.mdl.defaultLocation || {}
      return _.toString(l.longitude) + ',' + _.toString(l.latitude)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const data = _.cloneDeep(this.sysConfig)
      if (!data.img) {
        data.img = undefined
      }
      if (!data.defaultLocation) {
        data.defaultLocation = { longitude: 0, latitude: 0 }
      }
      if (!data.accessIp) {
        data.accessIp = '127.0.0.1'
      }
      this.mdl = data
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
      }
      if (info.file.status === 'done') {
        this.mdl.img = info.file.response.result
        this.$message.success('上传成功')
      }
    },
    saveBasic() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // if (_.startsWith(this.mdl.img, 'api/')) {
          //   this.mdl.img = this.mdl.img.replace('api/', '')
          // }
          this.$http.post('/system/config', { id: 'sysconfig', config: this.mdl }).then((resp) => {
            if (resp.success) {
              this.$message.success('操作成功')
              store.dispatch('getSysConfig')
            }
          })
        }
      })
    },
    openLocation() {
      this.$refs.LocationConfig.open(this.mdl.defaultLocation || {})
    },
    selectLocation(value) {
      this.mdl.defaultLocation = value
      this.$refs.LocationConfig.close()
    }
  }
}
</script>

<style lang="less" scoped>
.account-settings-info-main {
  width: 100%;
  display: flex;
  height: 100%;
  overflow: auto;

  &.mobile {
    display: block;

    .account-settings-info-left {
      border-right: unset;
      border-bottom: 1px solid #e8e8e8;
      width: 100%;
      height: 50px;
      overflow-x: auto;
      overflow-y: scroll;
    }
    .account-settings-info-right {
      padding: 20px 40px;
    }
  }

  .account-settings-info-left {
    border-right: 1px solid #e8e8e8;
    width: 224px;
  }

  .account-settings-info-right {
    flex: 1 1;
    padding: 8px 40px;

    .account-settings-info-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      margin-bottom: 12px;
    }
    .account-settings-info-view {
      padding-top: 12px;
    }
  }
}
</style>
