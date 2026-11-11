import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// CI builds for GitHub Pages use the repo sub-path; local builds use root.
const base = process.env.GITHUB_ACTIONS ? '/CA-StudySite/' : '/'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
})
