import { NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

const navItems = [
  { to: '/', label: 'Digest' },
  { to: '/profile', label: 'Profile' },
  { to: '/history', label: 'History' },
  { to: '/favorites', label: 'Favorites' },
];

export function Layout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.logo}>DevCoach</span>
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
