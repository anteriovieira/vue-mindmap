import Mindmap from 'src/Mindmap'
import { createVM } from '../helpers/utils'

import map from '../helpers/map'

const newVM = (context) => createVM(
  context,
  `<mindmap :nodes="nodes" :connections="connections" />`,
  { data: map, components: { Mindmap }}
)

describe('Mind Map', function () {
  it('should exist svg', function () {
    const vm = newVM(this)

    vm.$el.querySelector('svg').should.exist
  })

  it('should exist by svg class', function () {
    const vm = newVM(this)

    vm.$el.querySelector('.mindmap-svg').should.exist
  })
})
