import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSubNav from "../components/AdminSubNav";
import { cancelReservation, fetchHostReservations } from "../api/client";
import "./AdminPage.css";
import "./ReservationsPage.css";

function formatDate(value) {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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

  async function handleDelete(reservation) {
    const guestName = reservation.user?.username || reservation.user?.email || "this guest";
    const propertyName = reservation.accommodation?.location || "this stay";
    const confirmed = window.confirm(
      `Delete the booking for ${guestName} at ${propertyName}?`
    );
    if (!confirmed) return;

    setDeletingId(reservation._id);
    setError("");

    try {
      await cancelReservation(reservation._id);
      setReservations((current) => current.filter((row) => row._id !== reservation._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-app">
      <AdminHeader />
      <AdminSubNav />
      <main className="admin-page reservations-page">
        <header className="reservations-page__heading">
          <h1>My Reservations</h1>
        </header>

        {error && (
          <p className="admin-page__error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="admin-page__muted reservations-page__status">Loading reservations…</p>
        ) : reservations.length === 0 ? (
          <div className="reservations-page__empty">
            <p>No reservations yet.</p>
            <p className="admin-page__muted">
              When guests book your listings on the public site, they will appear here.
            </p>
          </div>
        ) : (
          <div className="reservations-page__table-wrap">
            <table className="reservations-page__table">
              <thead>
                <tr>
                  <th>Booked by</th>
                  <th>Property name</th>
                  <th>Check-in Date</th>
                  <th>Check-out Date</th>
                  <th className="reservations-page__actions-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((row) => (
                  <tr key={row._id}>
                    <td>{row.user?.username || row.user?.email || "—"}</td>
                    <td>{row.accommodation?.location || row.accommodation?.title || "—"}</td>
                    <td>{formatDate(row.checkIn)}</td>
                    <td>{formatDate(row.checkOut)}</td>
                    <td className="reservations-page__actions">
                      <button
                        type="button"
                        className="reservations-page__delete"
                        onClick={() => handleDelete(row)}
                        disabled={deletingId === row._id}
                      >
                        {deletingId === row._id ? "Deleting…" : "Delete"}
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
