import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { onMounted, nextTick } from 'vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import './style.css'
import 'vitepress-plugin-tabs/client'

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

/**
 * Handles tab activation based on URL hash
 */
function handleTabHash() {
  if (typeof document === 'undefined') return

  const hash = window.location.hash.slice(1) // Remove the '#'
  if (!hash) return

  console.log('Looking for hash:', hash)

  const tabButtons = document.querySelectorAll('[role="tab"]')

  if (tabButtons.length === 0) {
    console.log('No tabs found on page')
    return
  }

  console.log('Found tabs:', tabButtons)

  tabButtons.forEach((button) => {
    const labelText = button.textContent?.trim().toLowerCase().replace(/\s+/g, '-')
    console.log('Tab label text:', labelText)

    if (labelText === hash) {
      console.log('Activating tab:', button)

      // Trigger multiple event types to ensure Vue picks it up
      const element = button as HTMLElement

      // Dispatch a proper mouse event
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })

      element.dispatchEvent(clickEvent)

      // Also try direct click
      element.click()

      // Set focus as well
      element.focus()
    }
  })
}

/**
 * Adds click listeners to tabs to update URL hash
 */
function setupTabHashUpdates() {
  if (typeof document === 'undefined') return

  const tabButtons = document.querySelectorAll('[role="tab"]')

  tabButtons.forEach((button) => {
    const element = button as HTMLElement

    // Remove existing listener if any
    element.removeEventListener('click', updateHashOnTabClick)

    // Add new listener
    element.addEventListener('click', updateHashOnTabClick)
  })
}

function updateHashOnTabClick(event: Event) {
  const button = event.currentTarget as HTMLElement
  const labelText = button.textContent?.trim().toLowerCase().replace(/\s+/g, '-')

  if (labelText) {
    // Update URL hash without triggering scroll
    history.replaceState(null, '', `#${labelText}`)
  }
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    enhanceAppWithTabs(app)

    app.component('ApiParam', ApiParam)
    app.component('CodePanel', CodePanel)
    app.component('ResponsePanel', ResponsePanel)
    app.component('Card', Card)
    app.component('CardGroup', CardGroup)

    if (typeof window !== 'undefined') {
      router.onAfterRouteChanged = () => {
        nextTick(() => {
          updateLayout()
          handleTabHash()
          setupTabHashUpdates()
        })
      }

      // Listen for hash changes
      window.addEventListener('hashchange', () => {
        nextTick(handleTabHash)
      })
    }
  },
  setup() {
    if (typeof window !== 'undefined') {
      onMounted(() => {
        updateLayout()
        // Delay tab hash handling to ensure tabs are rendered
        setTimeout(() => {
          handleTabHash()
          setupTabHashUpdates()
        }, 100)
      })
    }
  }
} satisfies Theme
