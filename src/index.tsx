import 'normalize.css'
import { createRoot } from 'react-dom/client'
import App from './App'

import './style/index.scss'

const container = document.getElementById('root')
if (!container) {
  throw new Error('No root element found')
}
const root = createRoot(container)
root.render(<App />)
