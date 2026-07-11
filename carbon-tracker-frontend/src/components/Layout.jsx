import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Bot, Trophy, History, FlaskConical, LogOut, Sun, Moon, Leaf } from 'lucide-react';
import api from '../api';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { UserX } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // even if this fails, we still clear the local session and send them to login
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/user');
    } catch (e) {
      // even if this fails, we still clear the local token and send them to login
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
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
          <button className="btn-block" onClick={handleLogout} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <LogOut size={16} /> Logout
          </button>
          <button
            className="btn-block"
            onClick={() => setShowDeleteConfirm(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--clay)', color: 'white', borderColor: 'var(--clay)' }}
          >
            <UserX size={16} /> Delete Account
          </button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete your account?"
        message="This will permanently delete your account and all logged activities. This cannot be undone."
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}