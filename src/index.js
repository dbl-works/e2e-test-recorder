import './style.css'
import { setupApp } from './app'

const globalWindow = Function('return window')()

const init = () => {
  if (globalWindow.started) {
    return alert('Already started!')
  }

  globalWindow.started = true

  setupApp(document.getElementById('root'))
}

console.log(import.meta.env)
window.init = init
if (import.meta.env.VITE_WITH_FAKE_DATA) {
  init()
}
