import { getSelector } from './selector-utils'
import { addTestStep, dispatch, getState } from './store'
import { TestStep, TestStepTypes } from './test-steps'

export class DocumentSelectionHandler {
  static canHandle(event) {
    return !!event.target.getSelection().toString()
  }

  static handle() {
    const { selection } = getState()

    const selector = getSelector(selection.baseNode.parentElement)

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
