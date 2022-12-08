export function h(tag: keyof HTMLElementTagNameMap | Function, props: HTMLElement | any = {}, ...childrenOrArray: any[]) {
  const children = Array.isArray(childrenOrArray[0])
    ? childrenOrArray[0]
    : childrenOrArray

  if (typeof tag === 'function') {
    return tag({ ...props, children })
  }

  const element = document.createElement(tag) as any

  Object.keys(props).forEach((key) => {
    element[key as any] = props[key]
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

  return element as HTMLElement
}
