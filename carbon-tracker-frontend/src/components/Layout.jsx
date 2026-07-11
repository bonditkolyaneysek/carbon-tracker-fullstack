import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Bot, Trophy, History, FlaskConical, LogOut, Sun, Moon, Leaf } from 'lucide-react';
import api from '../api';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Executive Dashboard' },
  { to: '/log-activity', icon: ClipboardList, label: 'Log Carbon Activities' },
  { to: '/history', icon: History, label: 'Activity History' },
  { to: '/chatbot', icon: Bot, label: 'AI Chatbot' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard & Gamification' },
  { to: '/model-transparency', icon: FlaskConical, label: 'Model Transparency' },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';

  const handleLogout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Leaf size={20} /> EcoTrack System
        </div>
        <div className="sidebar-logged-in">
          Logged in as:<br />
          <span className="sidebar-email">{userEmail}</span>
        </div>

        <div className="sidebar-section-label">Navigate System Modules</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to}>
                <span className={`nav-dot ${location.pathname === item.to ? 'active' : ''}`} />
                <Icon size={16} style={{ marginRight: 6, verticalAlign: -3 }} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-logout">
          <button className="btn-block" onClick={toggleTheme} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="btn-block" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}