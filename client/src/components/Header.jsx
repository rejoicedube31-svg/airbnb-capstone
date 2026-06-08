import { Link } from "react-router-dom";
import "./Header.css";

/**
 * Top header — logo, location filter placeholder, profile area.
 * Why: Brief requires header on all public views; we expand it on later days.
 */
export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        airbnb
      </Link>

      <div className="header__search">
        <span className="header__search-label">Location</span>
        <input
          type="text"
          placeholder="Centurion, South Africa"
          defaultValue="Centurion"
          readOnly
          aria-label="Location filter"
        />
      </div>

      <div className="header__profile">
        <span className="header__host-link">Become a host</span>
        <button type="button" className="header__menu-btn" aria-label="Menu">
          ☰
        </button>
      </div>
    </header>
  );
}
