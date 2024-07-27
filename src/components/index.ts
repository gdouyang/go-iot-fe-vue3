import type { App } from 'vue'
import { Icon } from './Icon'
import { BaseButton } from './Button'
import { Table } from './Table'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
  app.component('BaseButton', BaseButton)
  app.component('PageTable', Table)
}
