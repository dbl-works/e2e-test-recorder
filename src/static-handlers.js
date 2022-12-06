import { getSelector, SUPPORTED_SELECTORS } from './selector-utils'
import { addTestStep, dispatch, getState } from './store'
import { TestStep, TestStepTypes } from './test-steps'

export class DocumentSelectionHandler {
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
