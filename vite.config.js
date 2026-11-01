import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://yuzza96.github.io/Quality-Control/
export default defineConfig({ base: '/Quality-Control/', plugins: [react()] })
