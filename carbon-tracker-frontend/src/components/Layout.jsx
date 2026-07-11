import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Bot, Trophy, History, FlaskConical, LogOut, Sun, Moon, Leaf, UserX } from 'lucide-react';
import api from '../api';
import { useTheme } from '../context/ThemeContext';
import ConfirmDialog from './ConfirmDialog';

const NAV_ITEMS = [ /* unchanged */ ];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = async () => { /* unchanged */ };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/user');
    } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        {/* brand, logged-in tag, nav — unchanged */}
        <div className="sidebar-logout">
          {/* theme toggle button — unchanged */}
          {/* logout button — unchanged */}
          <button className="btn-block" onClick={() => setShowDeleteConfirm(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--clay)', color: 'white', borderColor: 'var(--clay)' }}>
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