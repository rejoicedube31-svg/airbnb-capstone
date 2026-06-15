import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header({ locationValue, onLocationSearch }) {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [query, setQuery] = useState(locationValue || "Centurion");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setQuery(locationValue || "Centurion");
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
    const value = query.trim() || "Centurion";
    if (onLocationSearch) {
      onLocationSearch(value);
    } else {
      navigate(`/locations?location=${encodeURIComponent(value)}`);
    }
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        airbnb
      </Link>

      <form className="header__search" onSubmit={handleSubmit}>
        <span className="header__search-label">Location</span>
        <input
          type="text"
          placeholder="Centurion, South Africa"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Location filter"
        />
      </form>

      <div className="header__profile" ref={menuRef}>
        {!isLoggedIn && (
          <Link to="/login" className="header__host-link">
            Become a host
          </Link>
        )}

        {isLoggedIn && (
          <span className="header__greeting">Hi, {user?.username?.split(" ")[0]}</span>
        )}

        <button
          type="button"
          className="header__menu-btn"
          aria-label="Profile menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="header__avatar" aria-hidden="true">
            {isLoggedIn ? user?.username?.charAt(0)?.toUpperCase() : "☰"}
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
                  to="/locations?location=Centurion"
                  className="header__dropdown-item"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Browse Centurion
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
