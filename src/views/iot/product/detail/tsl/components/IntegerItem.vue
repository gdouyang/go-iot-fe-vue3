<template>
  <el-form-item label="单位">
    <el-input v-model="data.unit" :maxlength="32" style="width: 100%" />
  </el-form-item>
</template>

<script lang="jsx">
export default {
  name: 'IntegerItem',
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
