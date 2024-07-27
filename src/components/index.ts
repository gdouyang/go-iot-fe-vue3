import type { App } from 'vue'
import { Icon } from './Icon'
import { BaseButton } from './Button'
import { PageTable } from './Table'
import { Dialog } from './Dialog'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
  app.component('BaseButton', BaseButton)
  app.component('PageTable', PageTable)
  app.component('Dialog', Dialog)
}
