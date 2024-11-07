import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToolProvider } from './context/ToolContext.jsx'
import { CanvasProvider } from './context/CanvasContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToolProvider>
      <CanvasProvider>
        <App />
      </CanvasProvider>
    </ToolProvider>
  </StrictMode>,
)
