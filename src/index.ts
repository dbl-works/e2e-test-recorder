import './css/index.css'
import { setupApp } from './app'

const globalWindow = Function('return window')()

const init = () => {
  if (globalWindow.started) {
    return alert('Already started!')
  }

  globalWindow.started = true

  setupApp()
}

window._initRecorder = init
if (import.meta.env.VITE_WITH_FAKE_DATA) {
  init()
}
