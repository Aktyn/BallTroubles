import 'normalize.css'
import './style/index.scss'

import { createRoot } from 'react-dom/client'
import App from './App'
import i18n from './i18n'

console.log('Environment:', process.env.NODE_ENV)

i18n.then(() => {
  const container = document.getElementById('root')
  if (!container) {
    throw new Error('No root element found')
  }
  const root = createRoot(container)
  root.render(<App />)
})
