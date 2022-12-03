import { TestStepTypes } from "./test-steps"

export function testStepToCypressMapper({ type, args }) {
  switch (type) {
    case TestStepTypes.CLICK:
      return `cy.get('${args.selector}').click()`
    default:
      throw new Error(`Unknown test step type: ${testStep.type}`)
  }
}
