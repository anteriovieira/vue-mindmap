import VueMindmap from 'src/MindMap'
import { createVM } from '../helpers/utils'

describe('MindMap', function () {
  it('should render correct contents', function () {
    const vm = createVM(this, `<vue-mindmap />`, { components: { VueMindmap }})
    vm.$el.querySelector('.hello h1').textContent.should.eql('Hello World!')
  })
})
