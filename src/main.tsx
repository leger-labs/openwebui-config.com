import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initErrorTracking } from './utils/error-tracking'
import './index.css'

// Initialize error tracking
try {
  initErrorTracking()
} catch (error) {
  console.error('Failed to initialize error tracking:', error)
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found')
  document.body.innerHTML = '<div style="padding: 20px; font-family: monospace;">Failed to mount app: root element not found</div>'
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
}
