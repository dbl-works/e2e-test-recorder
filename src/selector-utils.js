import { getElementSelectors } from 'get-element-selectors'
import { ErrorBase } from './error-base'

export const SUPPORTED_SELECTORS = [
  'data-cy',
  'data-test',
  'data-testid',
  'id',
  'name',
]

export function getSelector(element) {
  const selector = getElementSelectors(element, {
    attributes: SUPPORTED_SELECTORS,
    maxResults: 1,
  })[0]

  validateSelector(selector)

  return selector
}

export class InvalidSelectorError extends ErrorBase {}

export function validateSelector(selector) {
  if (!selector) {
    throw new InvalidSelectorError(
      `No valid selector found, make sure that the element follows the best practices by by supporting one of the following attribute selectors: ${SUPPORTED_SELECTORS.join(
        ', '
      )}`
    )
  }

  if (selector.includes('>')) {
    throw new InvalidSelectorError(
      `The element itself should have one of the valid attribute selectors: ${SUPPORTED_SELECTORS.join(
        ', '
      )}; not its ancestors.`
    )
  }
}

export function simplifySelector(document, fullSelector) {
  const descends = fullSelector.split(' > ')

  for (let i = 1; i <= descends.length; i++) {
    const selector = descends.slice(-i).join(' > ')

    if (document.querySelectorAll(selector).length === 1) {
      return selector
    }
  }
}
