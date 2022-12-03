/**
* @param {string} tag
* @param {HTMLElement} props
*/
export function h(tag, props, ...childrenOrArray) {
  const element = document.createElement(tag);

  Object.keys(props).forEach(key => {
    element[key] = props[key];
  })

  const children = Array.isArray(childrenOrArray[0]) ? childrenOrArray[0] : childrenOrArray;

  children.forEach(child => {
    if (!(child instanceof HTMLElement)) {
      child = document.createTextNode(child.toString());
    }

    element.appendChild(child);
  })

  return element;
}
