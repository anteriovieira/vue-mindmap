import Mindmap from './Mindmap.js'
import '../sass/mindmap.sass'

function plugin (Vue, options = { tag: 'mindmap' }) {
  Vue.component(options.tag, Mindmap)
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
const version = '__VERSION__'
// Export all components too
export {
  Mindmap,
  version
}
