<template>
  <Dialog
    :title="title"
    ref="addModal"
    width="70%"
    style="margin-top: -3%"
    @confirm="submitData"
    @close="addClose"
  >
    <div :style="{ overflowY: 'auto', overflowX: 'hidden' }">
      <el-form :model="scene" ref="addAlarmForm" label-width="auto">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="规则名称"
              prop="name"
              :rules="[
                { required: true, message: '规则名称不能为空' },
                { max: 50, message: '不能超过50个字符' }
              ]"
            >
              <el-input v-model="scene.name" placeholder="输入规则名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="类型"
              prop="type"
              :rules="[{ required: true, message: '选择类型' }]"
            >
              <el-select v-model="scene.type" placeholder="选择类型">
                <el-option value="scene" label="场景联动"></el-option>
                <el-option value="alarm" label="设备告警"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="触发器类型"
              prop="triggerType"
              :rules="[{ required: true, message: '选择触发器类型' }]"
            >
              <el-select
                placeholder="选择触发器类型"
                v-model="scene.triggerType"
                @change="sceneTypeChange"
              >
                <el-option value="device" label="设备触发"></el-option>
                <el-option value="timer" label="定时触发"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="scene.triggerType === 'timer'">
            <el-form-item
              label="cron表达式"
              prop="cron"
              :rules="[
                { required: true, message: 'cron表达式不能为空' },
                { max: 50, message: '不能超过50个字符' }
              ]"
            >
              <el-input placeholder="cron表达式" v-model="scene.cron">
                <template #append>
                  <el-tooltip content="点击查看说明">
                    <Icon icon="carbon:help" @click="openDrawer = true" />
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 触发条件 -->
        <el-card
          v-if="scene.triggerType === 'device'"
          style="margin-bottom: 10px"
          size="small"
          shadow="never"
        >
          <Trigger :data="scene" />
        </el-card>
        <!-- 执行动作 -->
        <el-card size="small" shadow="never">
          <p style="font-size: 16px">执行动作</p>
          <Action
            v-for="(item, index) in actions"
            :key="index + '-action'"
            :action="item"
            :position="index"
            @save="saveAction"
            @remove="removeAction"
          />
          <el-button link type="primary" @click="addAction"> 执行动作 </el-button>
        </el-card>
      </el-form>
    </div>

    <el-drawer
      v-if="openDrawer"
      title="cron表达式说明"
      width="750"
      :model-value="true"
      @close="openDrawer = false"
    >
      <Doc type="Cron" />
    </el-drawer>
  </Dialog>
</template>
<script lang="jsx">
import { addScene, updateScene } from '../api.js'
import { newScene } from './triggers/data.js'
import { newEmtpyAction } from '@/views/iot/rule/modules/actions/data.js'
import Trigger from './triggers/TriggerIndex.vue'
import Action from './actions/index.vue'
import _ from 'lodash-es'

export default {
  name: 'SceneAdd',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  provide() {
    return {
      formChecker: this.formChecker
    }
  },
  components: {
    Trigger,
    Action
  },
  computed: {
    title() {
      return this.data && this.data.id ? '编辑规则' : '新建规则'
    }
  },
  data() {
    return {
      scene: {},
      actions: [],
      formChecker: new Map(),
      openDrawer: false,
      oldState: ''
    }
  },
  created() {
    this.scene = _.cloneDeep(this.data)
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.addModal.open()
    })
  },
  methods: {
    init() {
      const data = this.scene
      if (data && data.id) {
        this.oldState = data.state
        const actions = _.map(data.actions, (a) => {
          const deepa = _.cloneDeep(a)
          deepa.configuration = JSON.parse(deepa.configuration)
          return deepa
        })
        this.actions = _.isEmpty(actions) ? [newEmtpyAction()] : actions
      } else {
        this.scene = newScene()
        this.actions = [newEmtpyAction()]
      }
    },
    sceneTypeChange() {
      if (this.scene.triggerType === 'timer') {
        const s = newScene()
        s.name = this.scene.name
        s.triggerType = this.scene.triggerType
        this.scene = s
      } else {
        this.scene.cron = null
      }
    },
    removeAction(position) {
      this.actions.splice(position, 1)
    },
    addAction() {
      this.actions.push(newEmtpyAction())
    },
    saveAction(index, actionData) {
      this.actions.splice(index, 1, actionData)
    },
    submitData() {
      let isPass = true
      this.$refs.addAlarmForm.validate((valid) => {
        isPass = valid
      })
      this.formChecker.forEach((checker, key) => {
        if (!checker()) {
          console.error(key + '校验不通过')
          isPass = false
        }
      })
      if (!isPass) {
        this.$message.error('表单校验不通过')
        return
      }
      const data = _.cloneDeep(this.scene)
      if (data.triggerType === 'device') {
        data.trigger.filters = _.map(data.trigger.filters, (f) => {
          return {
            key: f.key,
            value: _.toString(f.value),
            operator: f.operator,
            logic: f.logic,
            dataType: f.valueType.type
          }
        })
      }
      if (_.isEmpty(this.actions)) {
        this.$message.error('请添加执行动作')
        return
      }
      data.actions = _.map(this.actions, (a) => {
        const deepa = _.cloneDeep(a)
        deepa.configuration = JSON.stringify(deepa.configuration)
        return deepa
      })
      console.log(data)
      let promise = null
      if (data.id) {
        promise = updateScene(data.id, data)
      } else {
        promise = addScene(data)
      }
      promise.then((resp) => {
        if (resp.success) {
          if (this.oldState === 'started') {
            this.$message.success('操作成功, 重新启动后生效')
          } else {
            this.$message.success('操作成功')
          }
          this.$emit('success', data)
        }
      })
    },
    addClose() {
      this.$emit('close')
    }
  }
}
</script>
