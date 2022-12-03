import getSelector from "get-selector"
import { addTestStep, dispatch, getState, removeStep } from "./store"
import { TestStep, TestStepTypes } from "./test-steps"


const peekTestSteps = () => getState().testSteps.concat().reverse()[0]


let timeoutId = null
function debounce(fn, ms = 5) {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(fn, ms)
}
export class ButtonOrAnchorClickInteractionHandler {
  static canHandle(event) {
    if (event.type !== 'click') return false

    const target = this.closestClickable(event.target) || event.target

    return ['BUTTON', 'A'].includes(target.nodeName) || ['button', 'link'].includes(target.role?.toLowerCase())
  }

  static handle(event) {
    const target = this.closestClickable(event.target)
    dispatch(
      addTestStep(new TestStep(TestStepTypes.CLICK, {selector: getSelector(target)})
    ))
  }

  static closestClickable(target) {
    return target.closest('a, button, [role="button"], [role="link"]')
  }
}

export class InputOrTextAreaChangeInteractionHandler {
  static canHandle(event) {
    const target = event.target

    return ['INPUT', 'TEXTAREA'].includes(target.nodeName)
  }

  static handle(event) {
    const target = event.target

    const lastTestStep = peekTestSteps()

    const newStep = this.makeStep(target)

    // Needs to be debounced here because focusing the input will trigger a change event.
    debounce(() => {
      // If the last test step is the same as the new one but with a different value (i.e. input with '' then with a value), we should replace it.
      if ([newStep.type, lastTestStep?.type].every((t) => t !== TestStepTypes.CLICK) && lastTestStep?.args?.selector === newStep.args.selector) {
        dispatch(removeStep(lastTestStep))
      }
      dispatch(addTestStep(newStep))
    })
  }

  static makeStep(target) {
    if (this.isCheckboxOrRadio(target)) {
      return new TestStep(TestStepTypes.CLICK, { selector: getSelector(target), value: target.checked })
    } else {
      return new TestStep(TestStepTypes.CHANGE, { selector: getSelector(target), value: target.value })
    }
  }

  static isCheckboxOrRadio(target) {
    return ['checkbox', 'radio'].includes(target.type)
  }
}

