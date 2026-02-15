import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/', label: 'Dashboard', permission: 'dashboard', icon: '📊' },
  { to: '/logs', label: 'Registro de actividad', permission: 'logs', icon: '📋' },
];

export function Sidebar({ isOpen = false, onClose }) {
  const { user, hasPermission, setRole } = useAuth();

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      <aside
        className={styles.sidebar}
        data-open={isOpen}
        aria-label="Navegación"
      >
        <div className={styles.brand}>
          <span className={styles.logo}>EC</span>
          <span className={styles.brandName}>Panel Empresarial</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map(
            (item) =>
              hasPermission(item.permission) && (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [styles.navLink, isActive ? styles.navLinkActive : ''].filter(Boolean).join(' ')
                  }
                  end={item.to === '/'}
                  onClick={handleNavClick}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </NavLink>
              )
          )}
        </nav>
        <div className={styles.user}>
<div className={styles.userAvatar}>US</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Usuario</span>
            <select
              className={styles.roleSelect}
              value={user.role}
              onChange={(e) => setRole(e.target.value)}
              title="Cambiar rol"
            >
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.MANAGER}>Manager</option>
              <option value={ROLES.VIEWER}>Viewer</option>
            </select>
          </div>
        </div>
      </aside>
    </>
  );
}
