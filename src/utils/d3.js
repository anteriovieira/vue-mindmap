import { drag, event, zoom } from 'd3'
import { getViewBox } from './dimensions'

/**
 * Bind data to a <TAG>, inside a G element, inside the given root element.
 * Root is a D3 selection, data is an object or array, tag is a string.
 */
const bindData = (root, data, tag) => (
  root.append('g')
    .selectAll(tag)
    .data(data)
    .enter()
    .append(tag)
)

/**
 * Bind connections to PATH tags on the given SVG
 */
export const d3Connections = (svg, connections) => (
  bindData(svg, connections, 'path')
   .attr('class', 'mindmap-connection')
)

/* eslint-disable no-param-reassign */
/**
 * Bind rodes to FOREIGNOBJECT tags on the given SVG,
 * and set dimensions and html.
 */
export const d3Nodes = (svg, nodes) => {
  const selection = svg.append('g')
    .selectAll('foreignObject')
    .data(nodes)
    .enter()

  const d3nodes = selection
    .append('foreignObject')
    .attr('class', 'mindmap-node')
    .attr('width', node => node.width + 4)
    .attr('height', node => node.height)
    .html(node => node.html)

  const d3subnodes = selection
    .append('foreignObject')
    .attr('class', 'mindmap-subnodes')
    .attr('width', node => node.nodesWidth + 4)
    .attr('height', node => node.nodesHeight)
    .html(node => node.nodesHTML)

  return {
    nodes: d3nodes,
    subnodes: d3subnodes
  }
}

/**
 * Callback for forceSimulation tick event.
 */
export const onTick = (conns, nodes, subnodes) => {
  const d = conn => [
    'M',
    conn.source.x,
    conn.source.y,
    'Q',
    conn.source.x + (conn.curve && conn.curve.x ? conn.curve.x : 0),
    conn.source.y + (conn.curve && conn.curve.y ? conn.curve.y : 0),
    ',',
    conn.target.x,
    conn.target.y
  ].join(' ')

  // Set the connections path.
  conns.attr('d', d)

  // Set nodes position.
  nodes
    .attr('x', node => node.x - (node.width / 2))
    .attr('y', node => node.y - (node.height / 2))

  // Set subnodes groups color and position.
  subnodes
    .attr('x', node => node.x + (node.width / 2))
    .attr('y', node => node.y - (node.nodesHeight / 2))
}

/*
 * Return drag behavior to use on d3.selection.call().
 */
export const d3Drag = (simulation, svg, nodes) => {
  const dragStart = (node) => {
    if (!event.active) {
      simulation.alphaTarget(0.2).restart()
    }

    node.fx = node.x
    node.fy = node.y
  }

  const dragged = (node) => {
    node.fx = event.x
    node.fy = event.y
  }

  const dragEnd = () => {
    if (!event.active) {
      simulation.alphaTarget(0)
    }

    svg.attr('viewBox', getViewBox(nodes.data()))
  }

  return drag()
    .on('start', dragStart)
    .on('drag', dragged)
    .on('end', dragEnd)
}

/* eslint-enable no-param-reassign */

/*
 * Return pan and zoom behavior to use on d3.selection.call().
 */
export const d3PanZoom = el => (
  zoom().scaleExtent([0.3, 5])
    .on('zoom', () => (
      el.selectAll('svg > g').attr('transform', event.transform)
    ))
)
