import { createAction, createReducer, createStore } from '../utils/store-utils'

const initialState = {
  testSteps: [],
  selectedMapper: null,
  compactMode: false,
  selection: null,
  frame: null,
}

export const addTestStep = createAction('ADD_TEST_STEP')
export const updateStep = createAction('UPDATE_STEP')
export const removeStep = createAction('REMOVE_STEP')
export const selectMapper = createAction('SELECT_MAPPER')
export const toggleCompactMode = createAction('TOGGLE_COMPACT_MODE')
export const setSelection = createAction('SET_SELECTION')
export const setFrame = createAction('SET_FRAME')

/**
 * @typedef {Object} Store
 * @property {() => initialState} getState
 * @property {(action: {type: string, payload: any}) => void} dispatch
 * @property {(listener: () => void) => () => void} subscribe
 */

/**
 * @type {Store}
 */
const store = createStore(
  createReducer(initialState, {
    [addTestStep]: (state, { payload }) => {
      return {
        ...state,
        testSteps: [...state.testSteps, payload],
      }
    },
    [updateStep]: (state, { payload }) => {
      return {
        ...state,
        testSteps: state.testSteps.map((step) => {
          if (step.id === payload.id) {
            return payload
          }
          return step
        }),
      }
    },
    [removeStep]: (state, { payload }) => {
      console.log(payload)
      return {
        ...state,
        testSteps: state.testSteps.filter(
          (testStep) => testStep.id !== payload.id
        ),
      }
    },
    [selectMapper]: (state, { payload }) => {
      return {
        ...state,
        selectedMapper: payload,
      }
    },
    [toggleCompactMode]: (state) => {
      return {
        ...state,
        compactMode: !state.compactMode,
      }
    },
    [setSelection]: (state, { payload }) => {
      return {
        ...state,
        selection: payload,
      }
    },
    [setFrame]: (state, { payload }) => {
      return {
        ...state,
        frame: payload,
      }
    },
  })
)

const { getState, dispatch, subscribe } = store

export { getState, dispatch, subscribe }

export default store
