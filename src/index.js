import MindMap from './MindMap.js'
import '../sass/mindmap.sass'

function plugin (Vue) {
  Vue.component('mind-map', MindMap)
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
const version = '__VERSION__'
// Export all components too
export {
  MindMap,
  version
}
