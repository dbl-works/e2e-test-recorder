import { getElementSelectors } from 'get-element-selectors'
import { ErrorBase } from './error-base'

const VALID_SELECTORS = ['data-cy', 'data-test', 'data-testid', 'id', 'name']

export function getSelector(element) {
  const selector = getElementSelectors(element, {
    attributes: VALID_SELECTORS,
    maxResults: 1,
  })[0]

  if (!selector) {
    throw new InvalidSelectorError(
      `No valid selector found, make sure that the element follows the best practices by by supporting one of the following attribute selectors: ${VALID_SELECTORS.join(
        ', '
      )}`
    )
  }

  return selector
}

export class InvalidSelectorError extends ErrorBase {}

export function simplifySelector(document, fullSelector) {
  const descends = fullSelector.split(' > ')

  for (let i = 1; i <= descends.length; i++) {
    const selector = descends.slice(-i).join(' > ')

    if (document.querySelectorAll(selector).length === 1) {
      return selector
    }
  }
}
