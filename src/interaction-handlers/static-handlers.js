import {
  getSelector,
  SUPPORTED_SELECTORS,
} from '../framework-mappers/cypress/selector-utils'
import { addTestStep, dispatch, getState, setSelection } from '../state/store'
import { TestStep, TestStepTypes } from '../models/test-steps'

export class DocumentSelectionHandler {
  static register(document) {
    document.addEventListener('selectionchange', (event) => {
      if (this.canHandle(event)) {
        dispatch(setSelection(event.target.getSelection()))
      } else {
        dispatch(setSelection(null))
      }
    })
  }

  static canHandle(event) {
    return !!event.target.getSelection().toString()
  }

  static handle() {
    const { selection } = getState()

    // In case of selection, we can't always rely on the target element for the selector.
    // What if it's a big paragraph coming from the DB? Thus, we can use the closest element that has a supported selector.
    const selector = getSelector(
      selection.baseNode.parentNode.closest(
        SUPPORTED_SELECTORS.map((s) => `[${s}]`)
      )
    )

    dispatch(
      addTestStep(
        new TestStep(TestStepTypes.CONTAIN, {
          selector,
          content: selection.toString(),
        })
      )
    )
  }
}
