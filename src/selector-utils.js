import _getSelector from 'get-selector'

export function getSelector(element) {
  return _getSelector(element).replace(/^html > body > /, '')
}
