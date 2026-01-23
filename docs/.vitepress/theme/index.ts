import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { onMounted, nextTick } from 'vue'

import './style.css'

import ApiParam from './components/ApiParam.vue'
import CodePanel from './components/CodePanel.vue'
import ResponsePanel from './components/ResponsePanel.vue'
import Card from './components/Card.vue'
import CardGroup from './components/CardGroup.vue'

/**
 * Adds 'api-page' class to hide the aside on API reference pages
 */
function updateLayout() {
  if (typeof document === 'undefined') return

  const path = window.location.pathname
  const isApiPage = path.includes('/api-reference/') &&
    !path.endsWith('/introduction') &&
    !path.endsWith('/introduction.html')

  const vpDoc = document.querySelector('.VPDoc')
  if (vpDoc) {
    vpDoc.classList.toggle('api-page', isApiPage)
  }
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('ApiParam', ApiParam)
    app.component('CodePanel', CodePanel)
    app.component('ResponsePanel', ResponsePanel)
    app.component('Card', Card)
    app.component('CardGroup', CardGroup)

    if (typeof window !== 'undefined') {
      router.onAfterRouteChanged = () => nextTick(updateLayout)
    }
  },
  setup() {
    if (typeof window !== 'undefined') {
      onMounted(updateLayout)
    }
  }
} satisfies Theme
