import { createAction, createReducer, createStore } from "./store-utils";


const initialState = {
  testSteps: [],
  selectedMapper: null,
};

export const addTestStep = createAction('ADD_TEST_STEP')
export const updateStep = createAction('UPDATE_STEP')
export const removeStep = createAction('REMOVE_STEP')
export const selectMapper = createAction('SELECT_MAPPER')

const store = createStore(
  createReducer(initialState, {
    [addTestStep]: (state, { payload }) => {
      return {
        ...state,
        testSteps: [...state.testSteps, payload],
      };
    },
    [updateStep]: (state, { payload }) => {
      return {
        ...state,
        testSteps: state.testSteps.map((step) => {
          if (step.id === payload.id) {
            return payload;
          }
          return step;
        }),
      }
    },
    [removeStep]: (state, { payload }) => {
      console.log(payload)
      return {
        ...state,
        testSteps: state.testSteps.filter((testStep) => testStep.id !== payload.id),
      };
    },
    [selectMapper]: (state, { payload }) => {
      return {
        ...state,
        selectedMapper: payload,
      };
    }
  })
);

const { getState, dispatch, subscribe } = store

export { getState, dispatch, subscribe }

export default store
