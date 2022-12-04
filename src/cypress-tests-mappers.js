import { TestStepTypes } from "./test-steps"

export function testStepToCypressSelectorMapper({ type, args }) {
  if (args.override) {
    return args.override
  }

  switch (type) {
    case TestStepTypes.CLICK:
      return `cy.get('${args.selector}').click()`
    case TestStepTypes.CHECK:
      return `cy.get('${args.selector}').first().${args.checked ? 'check' : 'uncheck'}()`
    case TestStepTypes.INPUT:
      return `cy.get('${args.selector}').type('${args.value}')`
    default:
      throw new Error(`Unknown test step type: ${testStep.type}`)
  }
}

export function testStepToCypressContainsMapper({ type, args }) {
  if (args.override) {
    return args.override
  }

  switch (type) {
    case TestStepTypes.CLICK:
      return `cy.contains('${args.content}').click()`
    case TestStepTypes.CHECK:
      return `cy.contains('${args.content}').first().${args.checked ? 'check' : 'uncheck'}()`
    case TestStepTypes.INPUT:
      // Inputs has no content, and usually have their own ID selector.
      return `cy.get('${args.selector}').type('${args.value}')`
    default:
      throw new Error(`Unknown test step type: ${testStep.type}`)
  }
}

