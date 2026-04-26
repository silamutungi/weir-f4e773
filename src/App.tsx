import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Pricing from './pages/Pricing'
import Detections from './pages/Detections'
import Licenses from './pages/Licenses'
import Earnings from './pages/Earnings'
import Disputes from './pages/Disputes'
import Support from './pages/Support'
import Support2 from './pages/Support2'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/support" element={<Support />} />
        <Route path="/support-help" element={<Support2 />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detections"
          element={
            <ProtectedRoute>
              <Detections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/licenses"
          element={
            <ProtectedRoute>
              <Licenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/earnings"
          element={
            <ProtectedRoute>
              <Earnings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/disputes"
          element={
            <ProtectedRoute>
              <Disputes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
