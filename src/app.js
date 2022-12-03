import getSelector from 'get-selector'
import { testStepToCypressMapper } from './cypress-tests-mappers';
import { h } from './dom-util';
import { ButtonOrAnchorClickInteractionHandler } from './interaction-handlers';
import { addTestStep, dispatch, getState, removeStep, subscribe } from './store';
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

  // frame.src = window.location.href;
  frame.className = 'h-full w-full flex-1'
  contentDiv.appendChild(frame);
}

function renderUI({ testSteps = [] }) {
  return h('div', { className: 'bg-slate-50 flex justify-between flex-col lg:flex-row h-[50vh] lg:h-[40vh]' }, [
    h('div', { className: 'flex-1 bg-blue-100 p-8 lg:w-1/2' }, 'Other options from here'),
    h('div', { className: 'p-8 flex-1 max-h-full' }, [
      h('div', {}, 'Steps:'),
      h('div', { className: 'rounded-md overflow-hidden h-full relative' },
        h('ol', { id: 'steps', className: 'overflow-scroll h-full' },
          testSteps.map((testStep, i) => {
            return h('li', { className: 'p-4 odd:bg-slate-200 even:bg-slate-100 relative' },
              h('span', { className: 'px-2 text-gray-400' }, `${i + 1}.`),
              h('span', { className: 'font-mono' }, testStepToCypressMapper(testStep)),
              h('button', {
                className: 'mx-4 hover:opacity-100 opacity-40 transition absolute right-0',
                onclick: () => {
                  if (!confirm('Are you sure you want to remove this step?')) return
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

  dispatch(addTestStep(new TestStep('CLICK', { selector: 'body button' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form button' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form button' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form button' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form button' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form button' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form button' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))
  dispatch(addTestStep(new TestStep('CLICK', { selector: 'form a' })))

  await waitUntil(() => !!frame.contentWindow.document.body);

  listenToClicks()

  eventLoop()
}
