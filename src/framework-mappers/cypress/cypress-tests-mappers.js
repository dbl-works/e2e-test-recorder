import { TestStep, TestStepTypes } from '../../models/test-steps'
import { FrameworkMapperBase } from '../framework-mapper-base'
import {
  getSelector,
  InvalidSelectorError,
  SUPPORTED_SELECTORS,
} from './selector-utils'

/**
 *
 * @param {TestStep} testStep
 * @returns {string}
 */
function fallbackTestStepsToCypressMapper({ type, args }) {
  switch (type) {
    case TestStepTypes.INPUT:
      // Inputs has no content, and usually have their own ID selector.
      // They shared by all mappers.
      return `cy.get('${args.selector}').type('${args.value}')`
    case TestStepTypes.CHECK:
      return `cy.get('${args.selector}').first().${
        args.checked ? 'check' : 'uncheck'
      }()`
    case TestStepTypes.CONTAIN:
      return `cy.get('${args.selector}').should('contain.text', '${args.content}')`
    default:
      throw new Error(`Unknown test step type: ${testStep.type}`)
  }
}

export class CypressSelectorMapper extends FrameworkMapperBase {
  /**
   *
   * @param {TestStep} testStep
   * @returns {string}
   */
  static map(testStep) {
    if (testStep.override) {
      return args.override
    }

    switch (testStep.type) {
      case TestStepTypes.CLICK:
        return `cy.get('${testStep.selector}').click()`
      default:
        return fallbackTestStepsToCypressMapper(testStep)
    }
  }

  static getSelector(element) {
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

export class CypressContainMapper extends FrameworkMapperBase {
  /**
   *
   * @param {TestStep} testStep
   * @returns {string}
   */
  static map(testStep) {
    if (testStep.override) {
      return args.override
    }

    switch (testStep.type) {
      case TestStepTypes.CLICK:
        return `cy.contains('${testStep.content}').click()`
      default:
        return fallbackTestStepsToCypressMapper(testStep)
    }
  }

  static getSelector(element) {
    return getSelector(element)
  }
}
