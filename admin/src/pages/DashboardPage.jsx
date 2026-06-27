import { Link } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import { useAuth } from "../context/AuthContext";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="admin-app">
      <AdminHeader />
      <main className="dashboard">
        <section className="dashboard__hero">
          <p className="dashboard__eyebrow">Host dashboard</p>
          <h1>Welcome back, {user?.username?.split(" ")[0] || "Host"}</h1>
          <p className="dashboard__lead">
            Manage your listings, upload photos, and review guest reservations from one place.
          </p>
        </section>

        <section className="dashboard__grid" aria-label="Quick actions">
          <article className="dashboard__card">
            <h2>Listings</h2>
            <p>Create, edit, and remove accommodation listings for your properties.</p>
            <Link to="/listings" className="dashboard__cta">
              Manage listings
            </Link>
          </article>

          <article className="dashboard__card">
            <h2>Reservations</h2>
            <p>See who booked your listings and track upcoming stays.</p>
            <Link to="/reservations" className="dashboard__cta">
              View reservations
            </Link>
          </article>

          <article className="dashboard__card dashboard__card--muted">
            <h2>Public site</h2>
            <p>Preview how guests see your listings on the main Airbnb-style client.</p>
            <a
              href={import.meta.env.VITE_CLIENT_URL || "http://localhost:5173"}
              className="dashboard__cta dashboard__cta--secondary"
              target="_blank"
              rel="noreferrer"
            >
              Open client site
            </a>
          </article>
        </section>
      </main>
    </div>
  );
}
