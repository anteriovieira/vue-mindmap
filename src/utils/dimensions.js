/*
 * Return the dimensions (width & height) that some HTML
 * with a given style would take in the page.
 */
export const getDimensions = (html, style, classname) => {
  const el = document.createElement('span')
  const dimensions = {}

  // Set display: inline-block so that the size of el
  // will depend on the size of its children.
  el.style.display = 'inline-block'

  // Hide the element (it will be added to the page for a short time).
  el.style.visibility = 'hidden'

  el.className = classname
  el.innerHTML = html

  // Apply CSS rules.
  Object.keys(style).forEach((rule) => {
    el.style[rule] = style[rule]
  })
  document.body.append(el)

  dimensions.width = el.offsetWidth
  dimensions.height = el.offsetHeight

  el.remove()
  return dimensions
}

/*
 * Return the dimensions of an SVG viewport calculated from
 * some given nodes.
 */
export const getViewBox = (nodes) => {
  const Xs = []
  const Ys = []

  nodes.forEach((node) => {
    const x = node.x || node.fx
    const y = node.y || node.fy

    if (x) {
      Xs.push(x)
    }

    if (y) {
      Ys.push(y)
    }
  })

  if (Xs.length === 0 || Ys.length === 0) {
    return '0 0 0 0'
  }

  // Find the smallest coordinates...
  const min = [
    Math.min(...Xs) - 150,
    Math.min(...Ys) - 150
  ]

  // ...and the biggest ones.
  const max = [
    (Math.max(...Xs) - min[0]) + 150,
    (Math.max(...Ys) - min[1]) + 150
  ]

  return `${min.join(' ')} ${max.join(' ')}`
}
