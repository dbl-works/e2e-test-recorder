import { TestStep, TestStepTypes } from '../../models/test-steps'
import { FrameworkMapperBase } from '../framework-mapper-base'
import {
  getSelector,
  InvalidSelectorError,
  SUPPORTED_SELECTORS,
} from './selector-utils'

function fallbackTestStepsToCypressMapper(testStep: TestStep): string {
  switch (testStep.type) {
    case TestStepTypes.INPUT:
      // Inputs has no content, and usually have their own ID selector.
      // They shared by all mappers.
      return `cy.get('${testStep.selector}').type('${testStep.value}')`
    case TestStepTypes.CHECK:
      return `cy.get('${testStep.selector}').first().${
        testStep.checked ? 'check' : 'uncheck'
      }()`
    case TestStepTypes.CONTAIN:
      return `cy.get('${testStep.selector}').should('contain.text', '${testStep.content}')`
    default:
      throw new Error(`Unknown test step type: ${testStep.type}`)
  }
}

export const CypressSelectorMapper : FrameworkMapperBase = class {
  static map(testStep: TestStep) {
    if (testStep.override) {
      return testStep.override
    }

    switch (testStep.type) {
      case TestStepTypes.CLICK:
        return `cy.get('${testStep.selector}').click()`
      default:
        return fallbackTestStepsToCypressMapper(testStep)
    }
  }

  static getSelector(element: HTMLElement) {
    const selector = getSelector(element)
    if (!selector) {
      throw new InvalidSelectorError(
        `The element does not have any of the following attributes: ${SUPPORTED_SELECTORS.join(
          ', '
        )}`
      )
    }
    return selector
  }
}

export const CypressContainMapper: FrameworkMapperBase = class {
  static map(testStep: TestStep) {
    if (testStep.override) {
      return testStep.override
    }

    switch (testStep.type) {
      case TestStepTypes.CLICK:
        return `cy.contains('${testStep.content}').click()`
      default:
        return fallbackTestStepsToCypressMapper(testStep)
    }
  }

  static getSelector(element: HTMLElement) {
    return getSelector(element)
  }
}
