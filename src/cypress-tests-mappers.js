import { TestStepTypes } from "./test-steps"

export function testStepToCypressMapper({ type, args }) {
  switch (type) {
    case TestStepTypes.CLICK:
      return `cy.get('${args.selector}').click()`
    case TestStepTypes.INPUT:
      return `cy.get('${args.selector}').type('${args.value}')`
    default:
      throw new Error(`Unknown test step type: ${testStep.type}`)
  }
}
