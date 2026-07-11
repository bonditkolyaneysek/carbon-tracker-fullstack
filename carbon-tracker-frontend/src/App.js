import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ActivityForm from './pages/ActivityForm';
import History from './pages/History';
import Chatbot from './pages/Chatbot';
import Leaderboard from './pages/Leaderboard';
import ModelTransparency from './pages/ModelTransparency';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/log-activity" element={<ActivityForm />} />
        <Route path="/history" element={<History />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/model-transparency" element={<ModelTransparency />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;