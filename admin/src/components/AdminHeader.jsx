import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminHeader.css";

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || "http://localhost:5173";

export default function AdminHeader() {
  const { user, isLoggedIn, isHost, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="admin-header">
      <div className="admin-header__inner">
        <Link to="/" className="admin-header__logo" onClick={closeMenu}>
          <img src="/favicon.svg" alt="" width="32" height="32" />
          <span>Airbnb Admin</span>
        </Link>

        <nav className="admin-header__nav" aria-label="Main">
          {isLoggedIn && isHost ? (
            <>
              <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : undefined)}>
                Dashboard
              </NavLink>
              <NavLink to="/listings" className={({ isActive }) => (isActive ? "active" : undefined)}>
                Listings
              </NavLink>
              <NavLink to="/reservations" className={({ isActive }) => (isActive ? "active" : undefined)}>
                Reservations
              </NavLink>
            </>
          ) : (
            <a href={CLIENT_URL} className="admin-header__link">
              View public site
            </a>
          )}
        </nav>

        <div className="admin-header__actions">
          {isLoggedIn && isHost ? (
            <div className="admin-header__profile">
              <button
                type="button"
                className="admin-header__profile-btn"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <span className="admin-header__avatar" aria-hidden="true">
                  {user?.name?.charAt(0)?.toUpperCase() || "H"}
                </span>
                <span className="admin-header__greeting">Hi, {user?.name?.split(" ")[0] || "Host"}</span>
              </button>

              {menuOpen && (
                <div className="admin-header__dropdown" role="menu">
                  <Link to="/reservations" role="menuitem" onClick={closeMenu}>
                    Reservations
                  </Link>
                  <Link to="/listings" role="menuitem" onClick={closeMenu}>
                    Manage listings
                  </Link>
                  <button type="button" role="menuitem" onClick={() => { closeMenu(); logout(); }}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="admin-header__host-cta">
              Become a host
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
