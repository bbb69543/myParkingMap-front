import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SpeedInsights } from '@vercel/speed-insights/react'; // 引入 SpeedInsights
import { Analytics } from '@vercel/analytics/react'; // 引入 analytics


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <SpeedInsights />
    <Analytics />
  </StrictMode>,
)
