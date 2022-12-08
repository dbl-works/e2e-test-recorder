type Action = { type: string; payload?: any }

type Reducer<TState> = (state: TState, action: Action) => TState

export function createStore<TState>(reducer: Reducer<TState>) {
  let state = reducer(undefined as TState, { type: '@@INIT' })
  let listeners = [] as (() => void)[]

  return {
    getState() {
      return state
    },
    dispatch(action: Action) {
      state = reducer(state, action)
      listeners.forEach((listener) => listener())
    },
    subscribe(listener: () => void) {
      listeners.push(listener)
      return () => {
        listeners = listeners.filter((l) => l !== listener)
      }
    },
  }
}

export function createAction(type: string): any {
  const action = (payload: Record<string, any>) => ({ type, payload })
  action.toString = () => type
  return action
}

export function createReducer<T>(initialState: Required<T>, handlers: Record<string, Reducer<T>>) {
  return (state = initialState, action: Action) => {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
