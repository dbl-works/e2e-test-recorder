import {
  ButtonOrAnchorClickInteractionHandler,
  InputOrTextAreaInputInteractionHandler,
} from './interaction-handlers/interaction-handlers'
import { addTestStep, dispatch, selectMapper, setFrame } from './state/store'
import { TestStep } from './models/test-steps'
import { waitUntil } from './utils/utils'
import { DocumentSelectionHandler } from './interaction-handlers/static-handlers'
import { ErrorBase } from './utils/error-base'
import { renderUI } from './ui'
import { mappers } from './framework-mappers'
import { getSelectedMapper } from './state/mappers'

const contentDiv = document.createElement('div')
contentDiv.className = 'flex flex-col h-full'
const rootDiv = document.createElement('div')
contentDiv.prepend(rootDiv)

const frame = document.createElement('iframe') as HTMLIFrameElement & { contentDocument: Document & {  } }
const globalWindow = Function('return window')()

function wrapIntoIframe() {
  document.body.innerHTML = ''
  document.body.style.height = '100vh'

  document.body.append(contentDiv)

  if (import.meta.env.VITE_WITH_FAKE_DATA) {
    frame.src = `${window.location.protocol}//${window.location.host}/example.html`
  } else {
    frame.src = window.location.href
  }
  frame.className = 'h-full w-full flex-1'
  contentDiv.appendChild(frame)
}

const interactionHandlers = [
  ButtonOrAnchorClickInteractionHandler,
  InputOrTextAreaInputInteractionHandler,
  DocumentSelectionHandler,
]

function registerHandlers() {
  interactionHandlers.forEach((handler) => {
    handler.register(frame.contentDocument, { getMapper: () => getSelectedMapper()! })
  })
}

function listenToEvents() {
  /* Tracks the case where is the iframe has done a full reload. */
  if (frame.contentDocument._listenerIsAdded) {
    return
  }
  console.log('listening to events')

  registerHandlers()

  frame.contentDocument._listenerIsAdded = true
}

function eventLoop() {
  console.log('event loop')
  /* High Priority */
  setInterval(() => {
    listenToEvents()
  }, 1)
}

export async function setupApp() {
  wrapIntoIframe()

  dispatch(selectMapper(mappers['Cypress Selector']))
  dispatch(setFrame(frame))
  renderUI(rootDiv)

  if (import.meta.env.VITE_WITH_FAKE_DATA) {
    dispatch(
      addTestStep(
        new TestStep('CLICK', { selector: 'body button', content: 'Click' })
      )
    )
    dispatch(
      addTestStep(
        new TestStep('CLICK', { selector: 'form button', content: 'Submit' })
      )
    )
    dispatch(
      addTestStep(
        new TestStep('CLICK', { selector: 'form a', content: 'Visit' })
      )
    )
    dispatch(
      addTestStep(
        new TestStep('CLICK', { selector: 'form button', content: 'Submit' })
      )
    )
  }

  await waitUntil(() => !!frame.contentWindow?.document.body)

  eventLoop()

  globalWindow.addEventListener('error', ({ error }: { error: Error }) => {
    if (error instanceof ErrorBase) {
      alert(error.message)
    }
  })
}
