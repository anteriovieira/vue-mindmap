# VueMindmap

[![npm](https://img.shields.io/npm/v/vue-mindmap.svg)](https://www.npmjs.com/package/vue-mindmap) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> VueMindmap is a vue component for mindnode maps inspired by [react-mindmap](https://github.com/learn-anything/react-mindmap).

[Live demo](https://codesandbox.io/s/jv7pl7wn15) built on top of the awesome [codesandbox](https://codesandbox.io).

<p align="center">
  <img alt="vue-mindmap" src="https://raw.githubusercontent.com/anteriovieira/vue-mindmap/master/media/mindmap.png" />
</p>


## Installation

```bash
npm install --save vue-mindmap
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import VueMindmap from 'vue-mindmap'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'vue-mindmap/dist/vue-mindmap.css'

Vue.use(VueMindmap)
```

```html
<template>
  <mindmap
    :nodes="nodes"
    :connections="connections"
    :editable="true"
  />
</template>

<script>
  export default {
    name: 'MyMindmap',
    data() {
      return {
        nodes: [...],
        connections: [...]
      }
    }
  }
</script>
```

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<link rel="stylesheet" href="vue-mindmap/dist/vue-mindmap.css"></link>
<script src="vue-mindmap/dist/vue-mindmap.js"></script>

<!-- From CDN -->
<link rel="stylesheet" href="https://unpkg.com/vue-mindmap/dist/vue-mindmap.css"></link>
<script src="https://unpkg.com/vue-mindmap"></script>
```


## Props

| Prop            | Type    | Default | Description                                            |
|-----------------|:-------:|---------|--------------------------------------------------------|
| **nodes**       | Array   | [ ]      | Array of objects used to render nodes.                |
| **connections** | Array   | [ ]      | Array of objects used to render connections.          |
| **subnodes**    | Array   | [ ]      | Array of objects used to render subnodes.             |
| **editable**    | Boolean | false   | Enable editor mode, which allows to move around nodes. |

### nodes

Array of objects used to render nodes. Below an example of the node structure.

```json
{
  "text": "python",
  "url": "http://www.wikiwand.com/en/Python_(programming_language)",
  "fx": -13.916222252976013,
  "fy": -659.1641376795345,
  "category": "wiki",
  "note": ""
}
```

The possible attributes are:

- **text**: title of the node
- **url**: url contained in the node
- **fx** and **fy**: coordinates (if not present they'll be generated)
- **category**: category used to generate an emoji
- **note**: note that will be visible on hover

### connections

Array of objects used to render connections. Below an example of the connection
structure.

```json
{
  "source": "python",
  "target": "basics",
  "curve": {
    "x": -43.5535,
    "y": 299.545
  }
}
```

The possible attributes are:

- **source**: title of the node where the connection starts
- **target**: title of the node where the connection ends
- **curve.x** and **curve.y**: coordinates of the control point of a quadratic bezier curve
(if not specified the connection will be straight)

### subnodes
Array of objects used to render subnodes. The structure is the same as for nodes
with two additional attributes:

- **parent**: title of the parent node
- **color**: used for the margin color, needs to be a valid CSS color


## Styling
Here's a list of all CSS classes for styling:

- **.mindmap-svg**: main `svg` element containing the map;
- **.mindmap-node**: `foreignObject` element representing a node;
- **.mindmap-node--editable**: `foreignObject` element representing a node in editor mode;
- **.mindmap-subnode-group-text**: `foreignObject` element containing all subnodes of a given node;
- **.mindmap-subnode-text**: `div` element containing a subnode;
- **.mindmap-connection**: `path` element for each connection;
- **.mindmap-emoji**: `img` tag for emoji

## Development

### Launch visual tests

```bash
npm run dev
```

### Launch Karma with coverage

```bash
npm run dev:coverage
```

### Build

Bundle the js and css of to the `dist` folder:

```bash
npm run build
```

## License

[MIT](http://opensource.org/licenses/MIT)
