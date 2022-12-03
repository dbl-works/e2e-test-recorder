import { createAction, createReducer, createStore } from "./store-utils";


const initialState = {
  testSteps: [],
};

export const addTestStep = createAction('ADD_TEST_STEP')

export const removeStep = createAction('REMOVE_STEP')

const store = createStore(
  createReducer(initialState, {
    [addTestStep]: (state, { payload }) => {
      return {
        ...state,
        testSteps: [...state.testSteps, payload],
      };
    },
    [removeStep]: (state, { payload }) => {
      console.log(payload)
      return {
        ...state,
        testSteps: state.testSteps.filter((testStep) => testStep !== payload),
      };
    }
  })
);

const { getState, dispatch, subscribe } = store

export { getState, dispatch, subscribe }

export default store
