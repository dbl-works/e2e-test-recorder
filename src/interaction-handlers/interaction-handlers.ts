import { addTestStep, dispatch, getState, removeStep } from '../state/store'
import { TestStep, TestStepTypes } from '../models/test-steps'
import { InteractionHandlerConfig } from './types'

const peekTestSteps = () => getState().testSteps.concat().reverse()[0]

let timeoutId: number | undefined = undefined
function debounce(fn: Function, ms = 5) {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(fn, ms)
}

export class ButtonOrAnchorClickInteractionHandler {
  static register(document: Document, { getMapper }: InteractionHandlerConfig) {
    const instance = new this({ getMapper })
    document.addEventListener('click', (event) => {
      if (instance.canHandle(event)) {
        instance.handle(event)
      }
    })
  }

  public getMapper: InteractionHandlerConfig['getMapper']

  constructor({ getMapper }: InteractionHandlerConfig) {
    this.getMapper = getMapper
  }

  canHandle(event: Event) {
    if (event.type !== 'click') return false

    const target = this.closestClickable(event.target as Element) || event.target

    return this.isButton(target! as HTMLButtonElement & { role: string })
  }

  handle(event: Event) {
    const target = this.closestClickable(event.target as Element)!
    dispatch(
      addTestStep(
        new TestStep(TestStepTypes.CLICK, {
          selector: this.getSelector(target),
          content: target.textContent || target.value,
        })
      )
    )
  }

  getSelector(element: HTMLElement) {
    return this.getMapper().getSelector(element)
  }

  isButton(target: HTMLButtonElement & { role: string }) {
    if (target.tagName === 'INPUT') {
      return ['submit', 'button', 'reset'].includes(target.type.toLowerCase())
    }

    return (
      ['BUTTON', 'A'].includes(target.nodeName) ||
      ['button', 'link'].includes(target.role?.toLowerCase())
    )
  }

  closestClickable(target: Element | null) {
    return target?.closest(
      `a, button, [role="button"], [role="link"], input[type="submit"], input[type="button"], input[type="reset"]`
    ) as HTMLInputElement | HTMLButtonElement
  }
}

export class InputOrTextAreaInputInteractionHandler {
  static register(document: Document, { getMapper }: InteractionHandlerConfig) {
    const instance = new this({ getMapper })

    document.addEventListener('input', (event) => {
      if (instance.canHandle(event)) {
        instance.handle(event)
      }
    })
  }

  public getMapper: InteractionHandlerConfig['getMapper']

  constructor({ getMapper }: InteractionHandlerConfig) {
    this.getMapper = getMapper
  }

  canHandle(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement

    return ['INPUT', 'TEXTAREA'].includes(target.nodeName)
  }

  handle(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement

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

  getSelector(element: HTMLElement) {
    return this.getMapper().getSelector(element)
  }

  makeStep(target: HTMLInputElement | HTMLTextAreaElement & { checked?: boolean }) {
    if (this.isCheckboxOrRadio(target)) {
      return new TestStep(TestStepTypes.CHECK, {
        selector: this.getSelector(target),
        checked: target.checked,
      })
    } else {
      return new TestStep(TestStepTypes.INPUT, {
        selector: this.getSelector(target),
        value: target.value,
      })
    }
  }

  isCheckboxOrRadio(target: HTMLInputElement | HTMLTextAreaElement) {
    return ['checkbox', 'radio'].includes(target.type)
  }
}
