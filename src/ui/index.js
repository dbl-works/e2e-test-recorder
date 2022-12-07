import morphdom from 'morphdom'
import { mappers } from '../framework-mappers'
import { DocumentSelectionHandler } from '../interaction-handlers/static-handlers'
import { getSelectedMapper } from '../state/mappers'
import {
  dispatch,
  getState,
  removeStep,
  selectMapper,
  setSelection,
  subscribe,
  toggleCompactMode,
} from '../state/store'
import { h } from '../utils/dom-util'

function MapperSelector() {
  return h(
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
  )
}

function OptionsPanel() {
  return h('div', { className: 'lg:flex-1 bg-slate-50 pt-0 p-2 lg:w-1/2' }, [
    h('div', { className: 'flex space-x-4' }, [
      h('h2', { className: 'font-bold' }, 'Translator:'),
      h(MapperSelector),
    ]),
    h(TestSelectionPanel),
  ])
}

function TogglePanel() {
  const { compactMode } = getState()

  return h('div', {}, [
    h(
      'button',
      {
        className: 'text-2xl',
        title: 'Toggle Compact Mode',
        onclick: () => dispatch(toggleCompactMode()),
      },
      compactMode ? '⏬' : '⏫'
    ),
  ])
}

function TestSelectionPanel() {
  const { selection, frame } = getState()

  if (!selection) {
    return null
  }

  return h(
    'div',
    {
      className:
        'flex items-center space-x-2 justify-between relative my-2 bg-slate-100 rounded-md px-6  py-4 overflow-hidden',
    },
    [
      h('div', { className: 'flex space-x-2 items-center' }, [
        h('span', { className: 'text-sm select-none' }, 'Selected:'),
        h(
          'pre',
          {},
          `cy.get('...').should('contain.text', '${selection.toString()}')`
        ),
      ]),
      h(
        'div',
        { className: 'flex items-center' },
        h(
          'button',
          {
            className:
              'text-2xl absolute h-full right-0 px-2 bg-gradient-to-l from-slate-50 to-transparent',
            onclick: () => {
              DocumentSelectionHandler.handle({ target: frame.contentDocument })
              dispatch(setSelection(null))
            },
          },
          '👉'
        )
      ),
    ]
  )
}

function CompactPanel({ testSteps = [] }) {
  const lastStep = testSteps[testSteps.length - 1]

  return h(
    'div',
    {
      className:
        'bg-slate-100 items-stretch p-2 flex flex-col lg:flex-row justify-between px-4',
    },
    h('div', { className: 'flex items-center space-x-4' }, [
      h(TogglePanel),
      h(MapperSelector),
    ]),
    lastStep &&
      h(
        'div',
        {
          id: `test-step-${lastStep.id}`,
          className:
            'lg:w-1/2 h-full flex overflow-hidden font-mono rounded-md animate-[pulse_1.5s_ease-in-out]',
        },
        [
          h(
            'div',
            {
              className:
                'flex items-center space-x-2 h-full p-3 flex-1 bg-white relative',
            },
            h('pre', { className: 'select-none font-bold' }, '>'),
            h('pre', {}, getSelectedMapper().map(lastStep))
          ),
        ]
      )
  )
}

function App() {
  const { testSteps, compactMode } = getState()

  if (compactMode) {
    return h(CompactPanel, { testSteps })
  }

  return h(
    'div',
    { className: 'bg-slate-50' },
    h('div', { className: 'pt-4 px-4' }, h(TogglePanel)),
    h(
      'div',
      {
        className:
          'flex lg:justify-between flex-col lg:flex-row h-[50vh] lg:h-[40vh]',
      },
      [
        h(OptionsPanel),
        h('div', { className: 'pt-0 p-2 lg:flex-1 overflow-hidden' }, [
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
                      getState().testSteps.map(getSelectedMapper()).join(`\r\n`)
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
                    className:
                      'p-4 odd:bg-slate-200 even:bg-slate-100 relative flex items-center',
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
                        const defaultValue = getSelectedMapper().map({
                          ...testStep,
                          args: { ...testStep.args, override: null },
                        })
                        testStep.args.override =
                          defaultValue === e.target.innerHTML
                            ? null
                            : e.target.innerHTML
                      },
                    },
                    getSelectedMapper().map(testStep)
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
  )
}

export function renderUI(rootDiv) {
  rootDiv.appendChild(App())
  subscribe(() => {
    morphdom(rootDiv.firstChild, App())
  })
}
