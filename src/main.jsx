import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import { initLiquidGlass } from './liquidGlass.js'
import { initWallpaper } from './wallpaper.js'

createRoot(document.getElementById('root')).render(<App />)
initWallpaper()
initLiquidGlass()
