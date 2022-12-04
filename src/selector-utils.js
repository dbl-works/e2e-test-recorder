import _getSelector from 'get-selector'

export function getSelector(element) {
  return simplifySelector(element.ownerDocument, _getSelector(element))
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
