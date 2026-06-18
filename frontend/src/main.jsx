import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

if (import.meta.env.VITE_API_URL) {
  const apiURL = import.meta.env.VITE_API_URL.endsWith('/api')
    ? import.meta.env.VITE_API_URL.slice(0, -4)
    : import.meta.env.VITE_API_URL;
  axios.defaults.baseURL = apiURL;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
