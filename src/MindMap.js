import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  zoom,
  zoomIdentity
} from 'd3'

import {
  d3Connections,
  d3Nodes,
  d3Drag,
  d3PanZoom,
  onTick
} from './utils/d3'

import { getDimensions, getViewBox } from './utils/dimensions'
import subnodesToHTML from './utils/subnodesToHTML'
import nodeToHTML from './utils/nodeToHTML'

export default {
  props: {
    nodes: {
      type: Array,
      default: () => ([])
    },
    connections: {
      type: Array,
      default: () => ([])
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      simulation: null
    }
  },
  methods: {
    prepareNodes () {
      const render = (node) => {
        node.html = nodeToHTML(node)
        node.nodesHTML = subnodesToHTML(node.nodes)

        const dimensions = getDimensions(node.html, {}, 'mindmap-node')
        node.width = dimensions.width
        node.height = dimensions.height

        const nodesDimensions = getDimensions(node.nodesHTML, {}, 'mindmap-subnodes-text')
        node.nodesWidth = nodesDimensions.width
        node.nodesHeight = nodesDimensions.height
      }

      this.nodes.forEach(node => render(node))
    },
    /**
     * Add new class to nodes, attach drag behevior,
     * and start simulation.
     */
    prepareEditor (svg, conns, nodes, subnodes) {
      nodes
        .attr('class', 'mindmap-node mindmap-node--editable')
        .on('dbclick', (node) => {
          node.fx = null
          node.fy = null
        })

      nodes.call(d3Drag(this.simulation, svg, nodes))

      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick()
      }

      setTimeout(() => {
        this.simulation
          .alphaTarget(0.5).on('tick', () => (
            onTick(conns, nodes, subnodes)
          ))
      }, 200)
    },
    /**
     * Render mind map unsing D3
     */
    renderMap () {
      const svg = select(this.$refs.mountPoint)

      // Clear the SVG in case there's stuff already there.
      svg.selectAll('*').remove()

      // Add subnode group
      svg.append('g').attr('id', 'mindmap-subnodes')

      this.prepareNodes()

      // Bind data to SVG elements and set all the properties to render them
      const connections = d3Connections(svg, this.connections)
      const { nodes, subnodes } = d3Nodes(svg, this.nodes)

      nodes.append('title').text(node => node.note)

      // Bind nodes and connections to the simulation
      this.simulation
        .nodes(this.nodes)
        .force('link').links(this.connections)

      if (this.editable) {
        this.prepareEditor(svg, connections, nodes, subnodes)
      }

      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick()
      }

      onTick(connections, nodes, subnodes)

      svg.attr('viewBox', getViewBox(nodes.data()))
        .call(d3PanZoom(svg))
        .on('dbClick.zoom', null)
    }
  },
  mounted () {
    this.renderMap()
  },
  updated () {
    zoom().transform(select(this.$refs.mountPoint), zoomIdentity)

    this.renderMap()
  },
  created () {
    // Create force simulation to position nodes that have
    // no coordinate, and add it to the component state
    this.simulation = forceSimulation()
      .force('link', forceLink().id(node => node.text))
      .force('charge', forceManyBody())
      .force('collide', forceCollide().radius(100))
  },
  render () {
    return (
      <div>
        <svg class='mindmap-svg' ref='mountPoint'/>
      </div>
    )
  }
}
