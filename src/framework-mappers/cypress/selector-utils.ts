import { ErrorBase } from '../../utils/error-base'

export const SUPPORTED_SELECTORS = [
  'data-cy',
  'data-test',
  'data-testid',
  'id',
  'name',
] as const

export function getSelector(element: HTMLElement) {
  return getAttributesSelector(element, SUPPORTED_SELECTORS)
}

export function getAttributesSelector(element: HTMLElement, attributes: typeof SUPPORTED_SELECTORS) {
  const attribute = attributes.find((attr) => element.hasAttribute(attr))

  // TODO: this should be related to the mapper.
  // For example, if the mapper is for .content() selector, it should not be an error.
  if (!attribute) {
    return null
  }

  if (attribute === 'id') {
    return `#${element.getAttribute(attribute)}`
  }

  return `[${attribute}="${element.getAttribute(attribute)}"]`
}

export class InvalidSelectorError extends ErrorBase {}
