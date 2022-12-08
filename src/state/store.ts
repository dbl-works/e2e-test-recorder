import { FrameworkMapperBase } from '../framework-mappers/framework-mapper-base'
import { TestStep } from '../models/test-steps'
import { createAction, createReducer, createStore } from '../utils/store-utils'

const initialState = {
  testSteps: [] as TestStep[],
  selectedMapper: null as FrameworkMapperBase | null,
  compactMode: false,
  selection: null as any | null,
  frame: null as HTMLIFrameElement | null,
}

export const addTestStep = createAction('ADD_TEST_STEP')
export const updateStep = createAction('UPDATE_STEP')
export const removeStep = createAction('REMOVE_STEP')
export const selectMapper = createAction('SELECT_MAPPER')
export const toggleCompactMode = createAction('TOGGLE_COMPACT_MODE')
export const setSelection = createAction('SET_SELECTION')
export const setFrame = createAction('SET_FRAME')

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
