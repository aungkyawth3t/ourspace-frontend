import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import PartnerLink from './pages/PartnerLink'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

const Login = ({ onLogin }) => {
  return (
    <div className="h-screen flex items-center justify-center bg-rose-50">
      <button onClick={onLogin} className="bg-rose-500 text-white px-6 py-3 rounded-lg">
        Simulate Login
      </button>
    </div>
  )
}

function App() {

  const [user, setUser] = useState({ name: 'Alex', id: 1, couple_id: null });

  const handleLogin = () => {
    setUser({ name: 'Alex', id: 1, couple_id: 123 });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* protected route */}
        <Route element={<ProtectedRoute user={user} />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={ <Dashboard /> }/>
            <Route path="/link-partner" element={<PartnerLink setUser={setUser} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
