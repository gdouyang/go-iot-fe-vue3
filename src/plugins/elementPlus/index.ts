import type { App } from 'vue'

// 需要全局引入一些组件，如ElScrollbar，不然一些下拉项样式有问题
import {
  ElLoading,
  ElScrollbar,
  ElButton,
  ElBadge,
  ElInput,
  ElInputNumber,
  ElForm,
  ElFormItem,
  ElPopper,
  ElPopconfirm
} from 'element-plus'

const plugins = [ElLoading]

const components = [
  ElScrollbar,
  ElButton,
  ElBadge,
  ElInput,
  ElInputNumber,
  ElForm,
  ElFormItem,
  ElPopper,
  ElPopconfirm
]

export const setupElementPlus = (app: App<Element>) => {
  plugins.forEach((plugin) => {
    app.use(plugin)
  })

  components.forEach((component) => {
    app.component(component.name!, component)
  })

  // 为了开发环境启动更快，一次性引入所有样式
  if (import.meta.env.VITE_USE_ALL_ELEMENT_PLUS_STYLE === 'true') {
    import('element-plus/dist/index.css')
    return
  }
}
