import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminHeader.css";

export default function AdminHeader() {
  const { user, isLoggedIn, isHost, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="admin-header">
      <div className="admin-header__inner">
        <Link to="/listings" className="admin-header__logo" onClick={closeMenu}>
          airbnb
        </Link>

        <div className="admin-header__spacer" aria-hidden="true" />

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
                  {user?.username?.charAt(0)?.toUpperCase() || "H"}
                </span>
                <span className="admin-header__greeting">
                  Welcome, {user?.username?.split(" ")[0] || "Host"}
                </span>
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
