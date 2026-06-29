import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { openHostDashboard, isHostUser } from "../api/client";
import "./Header.css";

export default function Header({ locationValue, onLocationSearch, variant = "default" }) {
  const navigate = useNavigate();
  const { user, token, isLoggedIn, logout } = useAuth();
  const [query, setQuery] = useState(locationValue || "Cape Town");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isHome = variant === "home";

  useEffect(() => {
    setQuery(locationValue || "Cape Town");
  }, [locationValue]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const value = query.trim() || "Cape Town";
    const locationParam =
      value.toLowerCase() === "all locations" || value.toLowerCase() === "all"
        ? "all"
        : value;

    if (onLocationSearch) {
      onLocationSearch(locationParam);
    } else {
      navigate(`/locations?location=${encodeURIComponent(locationParam)}`);
    }
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  function handleHostDashboard() {
    setMenuOpen(false);
    openHostDashboard();
  }

  const isHost = isHostUser(user, token);

  return (
    <header className={`header${isHome ? " header--home" : ""}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo">
          airbnb
        </Link>

        {isHome ? (
          <nav className="header__nav" aria-label="Primary">
            <Link to="/locations?location=Cape Town" className="header__nav-link header__nav-link--active">
              Places to stay
            </Link>
            <a href="#experiences" className="header__nav-link">
              Experiences
            </a>
            <a href="#experiences" className="header__nav-link">
              Online Experiences
            </a>
          </nav>
        ) : (
          <form className="header__search" onSubmit={handleSubmit}>
            <span className="header__search-label">Location</span>
            <input
              type="text"
              placeholder="Cape Town, South Africa"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Location filter"
            />
          </form>
        )}

        <div className="header__profile" ref={menuRef}>
          {!isLoggedIn && (
            <Link to="/login" className="header__host-link">
              Become a host
            </Link>
          )}

          {isLoggedIn && !isHome && (
            <span className="header__greeting">Hi, {user?.username?.split(" ")[0]}</span>
          )}

          {isHome && (
            <button type="button" className="header__globe-btn" aria-label="Language and currency">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.18a15.7 15.7 0 00-1.12-4.02A8.03 8.03 0 0119.93 11zM12 4c.95 1.37 1.72 3.05 2.18 5H9.82C10.28 7.05 11.05 5.37 12 4zM4.07 13h3.18c.2 1.41.58 2.76 1.12 4.02A8.03 8.03 0 014.07 13zm3.18-2H4.07a8.03 8.03 0 014.3-4.02A15.7 15.7 0 007.25 11zm1.57 2h6.36c-.46 1.41-1.04 2.63-1.72 3.66A12.9 12.9 0 0112 20a12.9 12.9 0 01-1.54-3.34c-.68-1.03-1.26-2.25-1.72-3.66zm8.43 0h3.18a8.03 8.03 0 01-4.3 4.02c.54-1.26.92-2.61 1.12-4.02z"
                />
              </svg>
            </button>
          )}

          <button
            type="button"
            className={`header__menu-btn${isHome ? " header__menu-btn--home" : ""}`}
            aria-label="Profile menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {isHome && (
              <svg className="header__menu-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
              </svg>
            )}
            <span className="header__avatar" aria-hidden="true">
              {isLoggedIn ? (
                user?.username?.charAt(0)?.toUpperCase()
              ) : isHome ? (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                  />
                </svg>
              ) : (
                "☰"
              )}
            </span>
          </button>

          {menuOpen && (
            <div className="header__dropdown" role="menu">
              {isLoggedIn ? (
                <>
                  <p className="header__dropdown-user">{user?.email}</p>
                  <Link
                    to="/reservations"
                    className="header__dropdown-item"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    View reservations
                  </Link>
                  {isHost && (
                    <button
                      type="button"
                      className="header__dropdown-item"
                      role="menuitem"
                      onClick={handleHostDashboard}
                    >
                      Host dashboard
                    </button>
                  )}
                  <button
                    type="button"
                    className="header__dropdown-item header__dropdown-item--btn"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="header__dropdown-item"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/locations?location=Cape Town"
                    className="header__dropdown-item"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    Browse Cape Town
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
