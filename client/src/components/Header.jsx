import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";

/**
 * Top header — logo, location filter, profile area.
 * Why: Brief requires location filter in header on public views.
 */
export default function Header({ locationValue, onLocationSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(locationValue || "Centurion");

  useEffect(() => {
    setQuery(locationValue || "Centurion");
  }, [locationValue]);

  function handleSubmit(event) {
    event.preventDefault();
    const value = query.trim() || "Centurion";
    if (onLocationSearch) {
      onLocationSearch(value);
    } else {
      navigate(`/locations?location=${encodeURIComponent(value)}`);
    }
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

      <div className="header__profile">
        <span className="header__host-link">Become a host</span>
        <button type="button" className="header__menu-btn" aria-label="Menu">
          ☰
        </button>
      </div>
    </header>
  );
}
