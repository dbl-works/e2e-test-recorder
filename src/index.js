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

window.init = init
