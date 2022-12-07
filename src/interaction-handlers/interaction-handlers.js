import { addTestStep, dispatch, getState, removeStep } from '../state/store'
import { TestStep, TestStepTypes } from '../models/test-steps'

const peekTestSteps = () => getState().testSteps.concat().reverse()[0]

let timeoutId = null
function debounce(fn, ms = 5) {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(fn, ms)
}
export class ButtonOrAnchorClickInteractionHandler {
  static register(document, { getMapper }) {
    const instance = new this({ getMapper })
    document.addEventListener('click', (event) => {
      if (instance.canHandle(event)) {
        instance.handle(event)
      }
    })
  }

  constructor({ getMapper }) {
    /**
     * @type {() => typeof import('../framework-mappers/framework-mapper-base').FrameworkMapperBase}')}
     */
    this.getMapper = getMapper
  }

  canHandle(event) {
    if (event.type !== 'click') return false

    const target = this.closestClickable(event.target) || event.target

    return this.isButton(target)
  }

  handle(event) {
    const target = this.closestClickable(event.target)
    dispatch(
      addTestStep(
        new TestStep(TestStepTypes.CLICK, {
          selector: this.getSelector(target),
          content: target.textContent || target.value,
        })
      )
    )
  }

  getSelector(element) {
    return this.getMapper().getSelector(element)
  }

  isButton(target) {
    if (target.tagName === 'INPUT') {
      return ['submit', 'button', 'reset'].includes(target.type.toLowerCase())
    }

    return (
      ['BUTTON', 'A'].includes(target.nodeName) ||
      ['button', 'link'].includes(target.role?.toLowerCase())
    )
  }

  closestClickable(target) {
    return target.closest(
      `a, button, [role="button"], [role="link"], input[type="submit"], input[type="button"], input[type="reset"]`
    )
  }
}

export class InputOrTextAreaInputInteractionHandler {
  static register(document, { getMapper }) {
    const instance = new this({ getMapper })

    document.addEventListener('input', (event) => {
      if (event.target === frame.contentDocument) {
        return
      }

      if (this.canHandle(event)) {
        this.handle(event)
      }
    })
  }

  constructor({ getMapper }) {
    /**
     * @type {() => typeof import('../framework-mappers/framework-mapper-base').FrameworkMapperBase}')}
     */
    this.getMapper = getMapper
  }

  canHandle(event) {
    const target = event.target

    return ['INPUT', 'TEXTAREA'].includes(target.nodeName)
  }

  handle(event) {
    const target = event.target

    const lastTestStep = peekTestSteps()

    const newStep = this.makeStep(target)

    // Needs to be debounced here because focusing the input will trigger a change event.
    debounce(() => {
      // If the last test step is the same as the new one but with a different value (i.e. input with '' then with a value), we should replace it.
      if (
        [newStep.type, lastTestStep?.type].every(
          (t) => t === TestStepTypes.INPUT
        ) &&
        lastTestStep?.args?.selector === newStep.args.selector
      ) {
        dispatch(removeStep(lastTestStep))
      }
      dispatch(addTestStep(newStep))
    })
  }

  makeStep(target) {
    if (this.isCheckboxOrRadio(target)) {
      return new TestStep(TestStepTypes.CHECK, {
        selector: getSelector(target),
        checked: target.checked,
      })
    } else {
      return new TestStep(TestStepTypes.INPUT, {
        selector: getSelector(target),
        value: target.value,
      })
    }
  }

  isCheckboxOrRadio(target) {
    return ['checkbox', 'radio'].includes(target.type)
  }
}
