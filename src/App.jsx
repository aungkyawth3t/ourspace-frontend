import { BrowserRouter, Routes } from 'react-router-dom'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import PartnerLink from './pages/PartnerLink'
import './App.css'

const Login = ({ onLogin }) => {
  <div className="h-screen flex items-center justify-center bg-rose-50">
    <button onClick={onLogin} className="bg-rose-500 text-white px-6 py-3 rounded-lg">
      Simulate Login
    </button>
  </div>
}

const PartnetLink = () => {
  <div className="h-screen flex items-center justify-center bg-rose-50">
    <h1 className="text-2xl text-rose-600">Enter Partner Code Here</h1>
  </div>
}

function App() {

  const [user, setUser] = useState(null);
  const handleLogin = () => {
    setUser({ name: 'Alex', id: 1 });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* protected route */}
        <Route element={<ProtectedRoute user={user} />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={ user?.couple_id ? <Dashboard /> : <Navigate to="/link-partner" /> }/>
            <Route path="/link-partner" element={<PartnerLink setUser={setUser} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
