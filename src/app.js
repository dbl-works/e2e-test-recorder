import getSelector from 'get-selector'
import {
  testStepToCypressContainsMapper,
  testStepToCypressSelectorMapper,
} from './cypress-tests-mappers'
import { h } from './dom-util'
import {
  ButtonOrAnchorClickInteractionHandler,
  InputOrTextAreaChangeInteractionHandler,
} from './interaction-handlers'
import {
  addTestStep,
  dispatch,
  getState,
  removeStep,
  selectMapper,
  subscribe,
} from './store'
import { TestStep } from './test-steps'
import { waitUntil } from './utils'
import morphdom from 'morphdom'

const contentDiv = document.createElement('div')
contentDiv.className = 'flex flex-col h-full'
const rootDiv = document.createElement('div')
contentDiv.prepend(rootDiv)

const frame = document.createElement('iframe')
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

const mappers = {
  'Cypress Selector': testStepToCypressSelectorMapper,
  'Cypress Contains': testStepToCypressContainsMapper,
}

const getSelectedMapper = () => getState().selectedMapper

function OptionsPanel() {
  return h('div', { className: 'lg:flex-1 bg-slate-50 p-2 lg:w-1/2' }, [
    h('div', { className: 'flex justify-between' }, [
      h('h2', { className: 'text-xl' }, 'Mappers:'),
      h(
        'div',
        { className: 'space-x-2' },
        Object.keys(mappers).map((mapperName) => {
          const mapper = mappers[mapperName]
          return h(
            'label',
            {
              for: `mapper-${mapperName}`,
              className: `${
                mapper === getSelectedMapper() ? 'bg-gray-600' : 'bg-gray-400'
              } rounded-md px-2 py-1 text-white text-sm font-bold cursor-pointer
              `,
            },
            [
              h('input', {
                type: 'radio',
                className: 'mr-1 hidden',
                onclick: () => dispatch(selectMapper(mapper)),
                id: `mapper-${mapperName}`,
                name: 'mapper',
                value: mapperName,
                checked: mapper === getSelectedMapper(),
              }),
              mapperName,
              mapper === getSelectedMapper() &&
                h('span', { className: 'pl-1' }, '✅'),
            ]
          )
        })
      ),
    ]),
  ])
}

function renderUI({ testSteps = [] }) {
  return h(
    'div',
    {
      className:
        'bg-slate-50 flex lg:justify-between flex-col lg:flex-row h-[50vh] lg:h-[40vh]',
    },
    [
      h(OptionsPanel),
      h('div', { className: 'p-2 lg:flex-1 overflow-hidden' }, [
        h('div', { className: 'flex justify-between py-1' }, [
          'Steps:',
          getState().testSteps.length !== 0 &&
            h(
              'button',
              {
                className:
                  'active:bg-slate-600 hover:bg-slate-800 active:shadow-sm shadow-md bg-slate-700 text-sm font-bold px-4 py-1 text-white px-2 rounded',
                onclick: () => {
                  navigator.clipboard.writeText(
                    getState().testSteps.map(getSelectedMapper()).join('\n')
                  )
                },
              },
              'Copy Code 📋'
            ),
        ]),
        h(
          'div',
          { className: 'rounded-md overflow-hidden h-full pb-8 relative' },
          h(
            'ol',
            { id: 'steps', className: 'overflow-scroll h-full' },
            testSteps.map((testStep, i) => {
              return h(
                'li',
                {
                  id: `step-${testStep.id}`,
                  className: 'p-4 odd:bg-slate-200 even:bg-slate-100 relative',
                },
                h(
                  'span',
                  { className: 'px-2 text-gray-400 select-none' },
                  `${i + 1}.`
                ),
                h(
                  'span',
                  {
                    className: 'font-mono outline-none',
                    contentEditable: true,
                    oninput: (e) => {
                      // Have override only if they user input a different value.
                      const defaultValue = getSelectedMapper()({
                        ...testStep,
                        args: { ...testStep.args, override: null },
                      })
                      testStep.args.override =
                        defaultValue === e.target.innerHTML
                          ? null
                          : e.target.innerHTML
                    },
                  },
                  getSelectedMapper()(testStep)
                ),
                h(
                  'button',
                  {
                    className:
                      'mx-4 hover:opacity-100 opacity-40 transition absolute right-0 select-none',
                    onclick: () => {
                      if (
                        !confirm('Are you sure you want to remove this step?')
                      )
                        return
                      dispatch(removeStep(testStep))
                    },
                  },
                  '❌'
                )
              )
            })
          ),
          h('div', {
            className:
              'h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none w-full absolute bottom-0',
          })
        ),
      ]),
    ]
  )
}

const interactionHandlers = [
  ButtonOrAnchorClickInteractionHandler,
  InputOrTextAreaChangeInteractionHandler,
]

function listenToEvents() {
  /* Tracks the case where is the iframe has done a full reload. */
  if (frame.contentDocument._listenerIsAdded) {
    return
  }
  console.log('listening to events')

  frame.contentDocument.addEventListener('click', (event) => {
    if (event.target === frame.contentDocument) {
      return
    }

    const handler = interactionHandlers.find((interactionHandler) =>
      interactionHandler.canHandle(event)
    )
    if (handler) {
      handler.handle(event)
    }
  })

  frame.contentDocument.addEventListener('input', (event) => {
    if (event.target === frame.contentDocument) {
      return
    }

    const handler = interactionHandlers.find((interactionHandler) =>
      interactionHandler.canHandle(event)
    )
    if (handler) {
      handler.handle(event)
    }
  })

  frame.contentDocument._listenerIsAdded = true
}

function eventLoop() {
  console.log('event loop')
  /* High Priority */
  setInterval(() => {
    listenToEvents()
  }, 1)
}

function renderTo(target, element) {
  target.innerHTML = ''
  target.appendChild(element)
}

export async function setupApp(element) {
  wrapIntoIframe()

  dispatch(selectMapper(mappers['Cypress Selector']))

  renderTo(rootDiv, renderUI(getState()))
  subscribe(() => {
    morphdom(rootDiv.firstChild, renderUI(getState()))
  })

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

  await waitUntil(() => !!frame.contentWindow.document.body)

  eventLoop()
}
