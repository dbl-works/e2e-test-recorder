/**
 * @param {string} tag
 * @param {HTMLElement} props
 */
export function h(tag, props = {}, ...childrenOrArray) {
  const children = Array.isArray(childrenOrArray[0])
    ? childrenOrArray[0]
    : childrenOrArray

  if (typeof tag === 'function') {
    return tag({ ...props, children })
  }

  const element = document.createElement(tag)

  Object.keys(props).forEach((key) => {
    element[key] = props[key]
  })

  children.forEach((child) => {
    if (['undefined', 'boolean'].includes(typeof child)) {
      return
    }

    if (child === null) {
      return
    }

    if (!(child instanceof HTMLElement)) {
      child = document.createTextNode(child.toString())
    }

    element.appendChild(child)
  })

  return element
}
