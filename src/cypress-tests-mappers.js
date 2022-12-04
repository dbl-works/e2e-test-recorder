import { TestStepTypes } from './test-steps'

export function fallbackTestStepsToCypressMapper({ type, args }) {
  switch (type) {
    case TestStepTypes.INPUT:
      // Inputs has no content, and usually have their own ID selector.
      // They shared by all mappers.
      return `cy.get('${args.selector}').type('${args.value}')`
    case TestStepTypes.CHECK:
      return `cy.get('${args.selector}').first().${
        args.checked ? 'check' : 'uncheck'
      }()`
    default:
      throw new Error(`Unknown test step type: ${testStep.type}`)
  }
}

export function testStepToCypressSelectorMapper({ type, args }) {
  if (args.override) {
    return args.override
  }

  switch (type) {
    case TestStepTypes.CLICK:
      return `cy.get('${args.selector}').click()`
    default:
      return fallbackTestStepsToCypressMapper({ type, args })
  }
}

export function testStepToCypressContainsMapper({ type, args }) {
  if (args.override) {
    return args.override
  }

  switch (type) {
    case TestStepTypes.CLICK:
      return `cy.contains('${args.content}').click()`
    default:
      return fallbackTestStepsToCypressMapper({ type, args })
  }
}
