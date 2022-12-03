import getSelector from 'get-selector'
import { testStepToCypressMapper } from './cypress-tests-mappers';
import { h } from './dom-util';
import { ButtonOrAnchorClickInteractionHandler } from './interaction-handlers';
import { dispatch, getState, removeStep, subscribe } from './store';
import { TestStep } from './test-steps';
import { waitUntil } from './utils';

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

  frame.src = window.location.href;
  frame.className = 'h-full w-full flex-1'
  contentDiv.appendChild(frame);
}

function renderUI({ testSteps = [] }) {
  return h('div', { className: 'flex justify-between flex-row bg-red-200' }, [
    h('div', {}, [
      h('div', {}, 'Steps:'),
      h('ul', { id: 'steps' },
        testSteps.map((testStep) => {
          return h('li', {},
            testStepToCypressMapper(testStep),
            h('button', {
              className: 'ml-2',
              onclick: () => {
                if (!confirm('Are you sure you want to remove this step?')) return
                dispatch(removeStep(testStep))
              }
            }, 'x')
          )
        })
      ),
    ]),
    h('div', { className: 'bg-slate-100' }, 'Options from here'),
  ])
}

const interactionHandlers = [
  ButtonOrAnchorClickInteractionHandler,
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

  frame.contentDocument._listenerIsAdded = true
}


function eventLoop() {
  console.log('event loop')
  /* High Priority */
  setInterval(() => {
    listenToClicks()
  }, 1)

  /* Low Priority */
  setInterval(() => {
  }, 50)
}

function renderTo(target, element) {
  target.innerHTML = '';
  target.appendChild(element);
}

export async function setupApp(element) {

  wrapIntoIframe()

  renderTo(rootDiv, renderUI(getState()));
  subscribe(() => {
    renderTo(rootDiv, renderUI(getState()));
  })

  await waitUntil(() => !!frame.contentWindow.document.body);

  listenToClicks()

  eventLoop()
}
