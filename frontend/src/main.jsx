import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GymDataProvider } from './context/GymDataContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GymDataProvider>
      <App />
    </GymDataProvider>
  </StrictMode>,
)
