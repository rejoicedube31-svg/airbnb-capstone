import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { apiGet, cancelReservation } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./ReservationsPage.css";

function formatDate(value) {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function ReservationsPage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const isHost = user?.role === "host";

  const loadReservations = useCallback(async () => {
    if (!isLoggedIn || !user) return;

    const path =
      user.role === "host" ? "/api/reservations/host" : "/api/reservations/user";

    setLoading(true);
    setError("");

    try {
      const data = await apiGet(path, true);
      setReservations(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/reservations" } });
      return;
    }

    loadReservations();
  }, [isLoggedIn, navigate, loadReservations]);

  async function handleDelete(reservation) {
    const propertyName = reservation.accommodation?.location || "this stay";
    const confirmed = window.confirm(`Delete your reservation for ${propertyName}?`);
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
    <PageLayout layoutClass="page-layout--wide">
      <main className="reservations-page__main">
        <header className="reservations-page__header">
          <h1>{isHost ? "Reservations on your listings" : "My Reservations"}</h1>
          {!isHost && (
            <p className="reservations-page__subtitle">
              Hello, {user?.username} — trips you have booked.
            </p>
          )}
          {isHost && (
            <p className="reservations-page__subtitle">
              Hello, {user?.username} — bookings guests made for your listings.
            </p>
          )}
        </header>

        {loading && <p className="reservations-page__message">Loading reservations…</p>}
        {error && <p className="reservations-page__error">{error}</p>}

        {!loading && !error && reservations.length === 0 && (
          <p className="reservations-page__message">
            No reservations yet.{" "}
            <Link to="/locations?location=Cape Town">Browse Cape Town stays</Link>
          </p>
        )}

        {!loading && !error && reservations.length > 0 && (
          <div className="reservations-page__table-wrap">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Booked by</th>
                  <th>Property name</th>
                  <th>Check-in Date</th>
                  <th>Check-out Date</th>
                  <th className="reservations-table__actions-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((row) => (
                  <tr key={row._id}>
                    <td>
                      {isHost
                        ? row.user?.username || row.user?.email || "—"
                        : user?.username || "—"}
                    </td>
                    <td>{row.accommodation?.location || row.accommodation?.title || "—"}</td>
                    <td>{formatDate(row.checkIn)}</td>
                    <td>{formatDate(row.checkOut)}</td>
                    <td className="reservations-table__actions">
                      <button
                        type="button"
                        className="reservations-table__delete"
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
    </PageLayout>
  );
}
