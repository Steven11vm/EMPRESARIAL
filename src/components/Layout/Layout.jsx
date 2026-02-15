import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.css';

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <header className={styles.mobileHeader} aria-label="Menú principal">
        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span className={styles.hamburger} />
          <span className={styles.hamburger} />
          <span className={styles.hamburger} />
        </button>
        <span className={styles.mobileBrand}>Panel Empresarial</span>
      </header>

      <div
        className={styles.overlay}
        aria-hidden={!menuOpen}
        data-open={menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
