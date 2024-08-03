<template>
  <el-form-item label="时间格式">
    <a-auto-complete
      v-model="data.format"
      :dataSource="dateSource"
      placeholder="默认格式：String类型的UTC时间戳 (毫秒)"
      :filterOption="filterOption"
    />
  </el-form-item>
</template>

<script lang="jsx">
export default {
  name: 'DateItem',
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  created() {},
  data() {
    return {
      dateSource: [
        {
          text: 'String类型的UTC时间戳 (毫秒)',
          value: 'string'
        },
        'yyyy-MM-dd',
        'yyyy-MM-dd HH:mm:ss',
        'yyyy-MM-dd HH:mm:ss EE',
        'yyyy-MM-dd HH:mm:ss zzz'
      ]
    }
  },
  mounted() {},
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
      )
    }
  }
}
</script>
