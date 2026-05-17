import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { AuthProvider } from './context/AuthContext'
import { Toaster } from './components/ui/toaster'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>
        <AuthProvider>
          <App />
          {/* Global toast portal — renders outside normal tree */}
          <Toaster />
        </AuthProvider>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
