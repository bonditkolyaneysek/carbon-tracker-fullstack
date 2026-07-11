import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Leaf, KeyRound } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegisterLink, setShowRegisterLink] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '80px 40px', maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: 42, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Leaf size={38} /> Smart Carbon Footprint Tracker
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 20, marginTop: 16 }}>
        Final Project Defense Prototype
      </p>

      <hr />

      <h2 style={{ fontSize: 28, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <KeyRound size={24} /> Sign In
      </h2>

      <form onSubmit={handleSubmit}>
        <label className="label">Email Address</label>
        <input
          className="input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={showRegisterLink}
            onChange={(e) => setShowRegisterLink(e.target.checked)}
          />
          New user? Create an account
        </label>

        {showRegisterLink && (
          <p style={{ marginTop: -12, marginBottom: 20 }}>
            <Link to="/register" style={{ color: 'var(--leaf)' }}>Go to registration →</Link>
          </p>
        )}

        {error && <p style={{ color: 'var(--clay)', fontSize: 14, marginBottom: 16 }}>{error}</p>}

        <button type="submit" className="btn-block">Sign In</button>
      </form>
    </div>
  );
}