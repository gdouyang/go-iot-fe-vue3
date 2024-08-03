<template>
  <div>
    <el-form-item label="布尔值" style="height: 69px">
      <el-col :span="11">
        <el-input v-model="data.trueText" placeholder="trueText" />
      </el-col>
      <el-col :span="2" :push="1"> ~ </el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input v-model="data.trueValue" placeholder="trueValue" />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item style="height: 69px">
      <el-col :span="11">
        <el-input v-model="data.falseText" placeholder="falseText" />
      </el-col>
      <el-col :span="2" :push="1"> ~ </el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input v-model="data.falseValue" placeholder="falseValue" />
        </el-form-item>
      </el-col>
    </el-form-item>
  </div>
</template>

<script lang="jsx">
export default {
  name: 'BooleanItem',
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  created() {},
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
