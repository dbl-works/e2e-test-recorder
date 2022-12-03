import getSelector from 'get-selector'
import { testStepToCypressMapper } from './cypress-tests-mappers';
import { h } from './dom-util';
import { ButtonOrAnchorClickInteractionHandler, InputOrTextAreaChangeInteractionHandler } from './interaction-handlers';
import { addTestStep, dispatch, getState, removeStep, subscribe } from './store';
import { TestStep } from './test-steps';
import { waitUntil } from './utils';
import morphdom from 'morphdom'

const contentDiv = document.createElement('div');
contentDiv.className = 'flex flex-col h-full';
const rootDiv = document.createElement('div');
contentDiv.prepend(rootDiv)

const frame = document.createElement('iframe');
const globalWindow = Function('return window')()

function wrapIntoIframe() {
  document.body.innerHTML = '';
  document.body.style.height = '100vh';

  document.body.append(contentDiv);

  if (import.meta.env.VITE_WITH_FAKE_DATA) {
    frame.src = `${window.location.protocol}//${window.location.host}/second.html`;
  } else {
    frame.src = window.location.href
  }
  frame.className = 'h-full w-full flex-1'
  contentDiv.appendChild(frame);
}

function renderUI({ testSteps = [] }) {
  return h('div', { className: 'bg-slate-50 flex lg:justify-between flex-col lg:flex-row h-[50vh] lg:h-[40vh]' }, [
    h('div', { className: 'lg:flex-1 bg-blue-100 p-8 lg:w-1/2' }, 'Other options from here'),
    h('div', { className: 'p-8 lg:flex-1 my-2 overflow-hidden' }, [
      h('div', { className: 'flex justify-between py-1'}, [
        'Steps:',
        h('button', {
          className: 'active:bg-slate-600 hover:bg-slate-800 active:shadow-sm shadow-md bg-slate-700 text-sm font-bold px-4 py-1 text-white px-2 rounded',
          onclick: () => {
            navigator.clipboard.writeText(
              getState().testSteps.map(testStepToCypressMapper).join('\n')
            )
          },
        }, 'Copy Code 📋')
      ]),
      h('div', { className: 'rounded-md overflow-hidden h-full relative' },
        h('ol', { id: 'steps', className: 'overflow-scroll h-full' },
          testSteps.map((testStep, i) => {
            return h('li', { 'id': `step-${testStep.id}`, className: 'p-4 odd:bg-slate-200 even:bg-slate-100 relative' },
              h('span', { className: 'px-2 text-gray-400 select-none' }, `${i + 1}.`),
              h('span', { className: 'font-mono' }, testStepToCypressMapper(testStep)),
              h('button', {
                className: 'mx-4 hover:opacity-100 opacity-40 transition absolute right-0 select-none',
                onclick: () => {
                  if (!confirm('Are you sure you want to remove this step?')) return

                  console.log('removing step', testStep, getState().testSteps)
                  console.log('included?', getState().testSteps.includes(testStep))
                  dispatch(removeStep(testStep))
                }
              },
              '❌')
            )
          })
        ),
        h('div', { className: 'h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none w-full absolute bottom-0' })
      ),
    ]),
  ])
}

const interactionHandlers = [
  ButtonOrAnchorClickInteractionHandler,
  InputOrTextAreaChangeInteractionHandler,
]

function listenToClicks() {
  /* Tracks the case where is the iframe has done a full reload. */
  if (frame.contentDocument._listenerIsAdded) {
    return
  }
  console.log('listening to clicks')

  frame.contentDocument.addEventListener('click', (event) => {
    console.log('click', event, event.target)
    if (event.target === frame.contentDocument) {
      return
    }

    const handler = interactionHandlers.find((interactionHandler) => interactionHandler.canHandle(event))
    if (handler) {
      handler.handle(event)
    }
  })

  frame.contentDocument.addEventListener('change', (event) => {
    console.log('change', event, event.target)
    if (event.target === frame.contentDocument) {
      return
    }

    const handler = interactionHandlers.find((interactionHandler) => interactionHandler.canHandle(event))
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
    listenToClicks()
  }, 1)
}

function renderTo(target, element) {
  target.innerHTML = '';
  target.appendChild(element);
}

export async function setupApp(element) {

  wrapIntoIframe()

  renderTo(rootDiv, renderUI(getState()));
  subscribe(() => {
    morphdom(rootDiv.firstChild, renderUI(getState()))
  })

  if (import.meta.env.VITE_WITH_FAKE_DATA) {
    dispatch(addTestStep(new TestStep('CLICK', { selector: 'body button' })))
    dispatch(addTestStep(new TestStep('CLICK', { selector: 'form button' })))
    dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
    dispatch(addTestStep(new TestStep('CLICK', { selector: 'form button' })))
  }

  await waitUntil(() => !!frame.contentWindow.document.body);

  listenToClicks()

  eventLoop()
}
