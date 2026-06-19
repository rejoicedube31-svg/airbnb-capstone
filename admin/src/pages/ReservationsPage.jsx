import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import { cancelReservation, fetchHostReservations } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./AdminPage.css";
import "./ReservationsPage.css";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  async function loadReservations() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchHostReservations();
      setReservations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  async function handleCancel(reservation) {
    const guestName = reservation.user?.username || reservation.user?.email || "this guest";
    const confirmed = window.confirm(
      `Cancel the booking for ${guestName} at "${reservation.accommodation?.title || "this listing"}"?`
    );
    if (!confirmed) return;

    setCancellingId(reservation._id);
    setError("");

    try {
      await cancelReservation(reservation._id);
      setReservations((current) => current.filter((row) => row._id !== reservation._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="admin-app">
      <AdminHeader />
      <main className="admin-page reservations-page">
        <div className="admin-page__header">
          <div>
            <p className="admin-page__eyebrow">Day 22</p>
            <h1>Reservations on your listings</h1>
            <p className="admin-page__lead">
              Hello, {user?.username} — bookings guests made for your Centurion properties.
            </p>
          </div>
          <Link to="/listings" className="admin-page__secondary-btn">
            Manage listings
          </Link>
        </div>

        {error && <p className="admin-page__error" role="alert">{error}</p>}

        {loading ? (
          <p className="admin-page__muted">Loading reservations…</p>
        ) : reservations.length === 0 ? (
          <div className="reservations-page__empty">
            <p>No reservations yet.</p>
            <p className="admin-page__muted">
              When guests book your listings on the public site, they will appear here.
            </p>
            <a
              href={import.meta.env.VITE_CLIENT_URL || "http://localhost:5173"}
              className="admin-page__primary-btn"
              target="_blank"
              rel="noreferrer"
            >
              Open public site
            </a>
          </div>
        ) : (
          <div className="reservations-page__table-wrap">
            <table className="reservations-page__table">
              <thead>
                <tr>
                  <th>Listing</th>
                  <th>Location</th>
                  <th>Guest</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Nights</th>
                  <th>Total</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {reservations.map((row) => (
                  <tr key={row._id}>
                    <td>{row.accommodation?.title || "—"}</td>
                    <td>{row.accommodation?.location || "—"}</td>
                    <td>{row.user?.username || row.user?.email || "—"}</td>
                    <td>{formatDate(row.checkIn)}</td>
                    <td>{formatDate(row.checkOut)}</td>
                    <td>{row.guests}</td>
                    <td>{row.nights}</td>
                    <td>R {row.totalPrice}</td>
                    <td className="reservations-page__actions">
                      <button
                        type="button"
                        onClick={() => handleCancel(row)}
                        disabled={cancellingId === row._id}
                      >
                        {cancellingId === row._id ? "Cancelling…" : "Cancel"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
