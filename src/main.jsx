import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Auth from './pages/Auth.jsx'
import Homepage from './pages/Homepage.jsx'
import './i18n.js'
import ProtectedRoute from './components/ProtectedRoute.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
