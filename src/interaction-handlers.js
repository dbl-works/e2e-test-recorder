import getSelector from "get-selector"
import { addTestStep, dispatch } from "./store"
import { TestStep } from "./test-steps"


export class ButtonOrAnchorClickInteractionHandler {
  static canHandle(event) {
    const target = event.target.closest('a, button') || event.target

    return ['BUTTON', 'A'].includes(target.nodeName)
  }

  static handle(event) {
    const target = event.target.closest('a, button')
    dispatch(
      addTestStep(new TestStep('CLICK', {selector: getSelector(target)})
    ))
  }
}

