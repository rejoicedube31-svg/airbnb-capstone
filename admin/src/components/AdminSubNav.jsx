import { NavLink, useLocation } from "react-router-dom";
import "./AdminSubNav.css";

function reservationsActive(pathname) {
  return pathname === "/reservations" || pathname === "/view-reservations";
}

function listingsActive(pathname) {
  return (
    pathname === "/listings" ||
    pathname === "/view-listings" ||
    /\/listings\/[^/]+\/edit$/.test(pathname)
  );
}

function createActive(pathname) {
  return pathname === "/listings/new";
}

export default function AdminSubNav() {
  const { pathname } = useLocation();

  return (
    <nav className="admin-subnav" aria-label="Host navigation">
      <NavLink
        to="/reservations"
        className={() => (reservationsActive(pathname) ? "active" : undefined)}
      >
        View Reservations
      </NavLink>
      <NavLink
        to="/listings"
        className={() => (listingsActive(pathname) ? "active" : undefined)}
      >
        View Listings
      </NavLink>
      <NavLink
        to="/listings/new"
        className={() => (createActive(pathname) ? "active" : undefined)}
      >
        Create Listing
      </NavLink>
    </nav>
  );
}
