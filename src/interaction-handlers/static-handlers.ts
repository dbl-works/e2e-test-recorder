import {
  getSelector,
  SUPPORTED_SELECTORS,
} from '../framework-mappers/cypress/selector-utils'
import { addTestStep, dispatch, getState, setSelection } from '../state/store'
import { TestStep, TestStepTypes } from '../models/test-steps'
import { InteractionHandlerConfig } from './types'

export class DocumentSelectionHandler {
  static register(document: Document, { getMapper }: InteractionHandlerConfig) {
    const instance = new this({ getMapper })

    document.addEventListener('selectionchange', (event) => {
      const target = event.target as Document

      if (instance.canHandle(event)) {
        dispatch(setSelection(target.getSelection()))
      } else {
        dispatch(setSelection(null))
      }
    })
  }

  public getMapper: InteractionHandlerConfig['getMapper']

  constructor({ getMapper }: InteractionHandlerConfig) {
    this.getMapper = getMapper
  }

  canHandle(event: Event) {
    const target = event.target as Document
    return !!(target.getSelection()?.toString())
  }

  handle() {
    const { selection } = getState()

    // In case of selection, we can't always rely on the target element for the selector.
    // What if it's a big paragraph coming from the DB? Thus, we can use the closest element that has a supported selector.
    const selector = getSelector(
      selection?.focusNode?.parentElement?.closest(
        SUPPORTED_SELECTORS.map((s) => `[${s}]`).join(',')
      )
    )

    dispatch(
      addTestStep(
        new TestStep(TestStepTypes.CONTAIN, {
          selector,
          content: selection?.toString(),
        })
      )
    )
  }
}
