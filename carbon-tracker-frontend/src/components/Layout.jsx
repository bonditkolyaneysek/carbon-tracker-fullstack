import { NavLink, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import api from '../api';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Executive Dashboard' },
  { to: '/log-activity', icon: '📝', label: 'Log Carbon Activities' },
  { to: '/chatbot', icon: '🤖', label: 'Small AI Chatbot' },
  { to: '/leaderboard', icon: '🏆', label: 'Leaderboard & Gamification' },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';

  const handleLogout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">🌱 EcoTrack System</div>
        <div className="sidebar-logged-in">
          Logged in as:<br />
          <span className="sidebar-email">{userEmail}</span>
        </div>

        <div className="sidebar-section-label">Navigate System Modules</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to}>
              <span className={`nav-dot ${location.pathname === item.to ? 'active' : ''}`} />
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-logout">
          <button className="btn-block" onClick={handleLogout}>🚪 Logout Simulation</button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}