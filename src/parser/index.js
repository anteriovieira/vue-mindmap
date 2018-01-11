#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const walkSync = require('fs-walk').walkSync

const { emojiToCategory, matchEmojis } = require('./emojis')
const { getText, getURL } = require('./regex')

// These two arguments must be directories.
const input = process.argv[2]
const output = process.argv[3]

// Using for converting URLs with IDs to full URLs.
const mapsLookup = {}

if (input === undefined || output === undefined) {
  // eslint-disable-next-line no-console
  console.log('No files were parsed due to insufficient arguments \nPlease run the parser with the following command: npm run parse "path/to/mindmap/json/folder" "path/to/output/folder"')
  process.exit()
}

/*
 * Equivalent to mkdir -p dirname.
 */
const mkdirs = (dirname) => {
  const parentDir = path.dirname(dirname)

  if (!fs.existsSync(parentDir)) {
    mkdirs(parentDir)
  }

  fs.mkdirSync(dirname)
}

/*
 * Recursively walk a directory and call a function on all its files.
 * Imported file and absolute path are the parameters passed to the callback function.
 */
const walkDir = (dirname, fn) => {
  walkSync(dirname, (basedir, filename, stat) => {
    const absPath = path.resolve('./', basedir, filename)

    if (stat.isDirectory()) {
      return walkDir(absPath, fn)
    }

    if (typeof fn === 'function') {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      fn(require(absPath), absPath)
    }

    return null
  })
}

/*
 * Take a node from MindNode format and return it in the following format:
 *
 *  {
 *    text: string,
 *    url: string,
 *    note: string || undefined,
 *    fx: number,
 *    fy: number,
 *    category: string,
 *  }
 */
const parseNode = (node) => {
  const parsedNode = {
    text: getText(node.title.text),
    note: node.note ? getText(node.note.text) : undefined,
    url: getURL(node.title.text),
    fx: node.location.x,
    fy: node.location.y,
    // eslint-disable-next-line no-use-before-define
    nodes: parseSubnodes(node.nodes)
  }

  // If URL is an internal URL that uses the map ID, switch it to
  // the full URL with the path.
  const matchInternalURL = parsedNode.url.match(/\/id\/(\S{40})/)
  if (matchInternalURL) {
    parsedNode.url = mapsLookup[matchInternalURL[1]]
  }

  if (parsedNode.note) {
    parsedNode.note = parsedNode.note.replace('if you think this can be improved in any way  please say', '')
  }

  const match = parsedNode.text.match(matchEmojis)

  if (match) {
    parsedNode.category = emojiToCategory(match[0])
    parsedNode.text = parsedNode.text.replace(matchEmojis, '').trim()
  }

  return parsedNode
}

/*
 * Parse an array of subnodes recursively. Uses parseNode, so the structure of
 * subnodes will be the same. The only difference is a color attribute on
 * subnodes, which has a string with a valid CSS color format.
 */
const parseSubnodes = subnodes => (
  subnodes.map((subnode) => {
    const parsedSub = parseNode(subnode)

    if (subnode.shapeStyle && subnode.shapeStyle.borderStrokeStyle) {
      parsedSub.color = subnode.shapeStyle.borderStrokeStyle.color
    }

    parsedSub.nodes = parseSubnodes(subnode.nodes)
    return parsedSub
  })
)

/*
 * Take a connection from MindNode format and return it in the following format:
 *
 *  {
 *    text: string,
 *    source: string,
 *    target: string,
 *    curve: {
 *      x: number,
 *      y: number,
 *    },
 *  }
 *
 * source and target are the text attributes of the nodes the connection links.
 * curve is the location of the focal point for a bezier curve.
 */
const parseConn = (conn, lookup) => {
  const parsedConn = {
    source: lookup[conn.startNodeID],
    target: lookup[conn.endNodeID],
    curve: {
      x: conn.wayPointOffset.x,
      y: conn.wayPointOffset.y
    }
  }

  if (conn.title && conn.title.text) {
    parsedConn.text = getText(conn.title.text)
  }

  return parsedConn
}

walkDir(input, (map, filename) => {
  const inputBasePath = `${path.resolve('./', input)}`
  let relativeFilePath = filename.replace(inputBasePath, '').replace('.json', '')

  if (relativeFilePath !== '/learn-anything') {
    relativeFilePath = relativeFilePath.replace('/learn-anything', '')
  }

  mapsLookup[map.token] = relativeFilePath
})

walkDir(input, (map, filename) => {
  const nodesLookup = {}
  const splitTitle = map.title.split('-')
  let trigger = map.trigger

  if (splitTitle[splitTitle.length - 1].trim(' ') === trigger) {
    trigger = ''
  }

  const parsedMap = {
    title: map.title,
    tag: trigger,
    description: map.description
  }

  // Parse all nodes and populate the lookup table, which will be used for
  // converting IDs to node title on connections.
  parsedMap.nodes = map.nodes.map((node) => {
    const parsedNode = parseNode(node)
    nodesLookup[node.id] = parsedNode.text
    return parsedNode
  })

  parsedMap.connections = map.connections.map(conn => parseConn(conn, nodesLookup))

  // Find out the path for the output file.
  const inputBasePath = path.resolve('./', input)
  const outputFile = path.join(output, filename.replace(inputBasePath, ''))
  const outputPath = path.dirname(outputFile)

  // Create folder if it doesn't exist.
  if (!fs.existsSync(outputPath)) {
    mkdirs(outputPath)
  }

  // Write parsed map to new location.
  fs.writeFileSync(outputFile, JSON.stringify(parsedMap, null, 2))
})
