import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CopyrightFooter from "../components/CopyrightFooter";
import { apiGet } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./ReservationsPage.css";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Reservations table — guest or host view from API.
 * Why: Brief requires profile option to view reservations in table format.
 */
export default function ReservationsPage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/reservations" } });
      return;
    }

    const path =
      user?.role === "host" ? "/api/reservations/host" : "/api/reservations/user";

    setLoading(true);
    apiGet(path, true)
      .then((data) => setReservations(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isLoggedIn, user, navigate]);

  const isHost = user?.role === "host";

  return (
    <div className="reservations-page">
      <Header />
      <main className="reservations-page__main">
        <header className="reservations-page__header">
          <h1>{isHost ? "Reservations on your listings" : "Your reservations"}</h1>
          <p>
            {isHost
              ? `Hello, ${user?.username} — bookings guests made for your Centurion properties.`
              : `Hello, ${user?.username} — trips you have booked.`}
          </p>
        </header>

        {loading && <p className="reservations-page__message">Loading reservations…</p>}
        {error && <p className="reservations-page__error">{error}</p>}

        {!loading && !error && reservations.length === 0 && (
          <p className="reservations-page__message">
            No reservations yet.{" "}
            <Link to="/locations?location=Centurion">Browse Centurion stays</Link>
          </p>
        )}

        {!loading && !error && reservations.length > 0 && (
          <div className="reservations-page__table-wrap">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Listing</th>
                  <th>Location</th>
                  {isHost && <th>Guest</th>}
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Nights</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((row) => (
                  <tr key={row._id}>
                    <td>
                      {row.accommodation?.title ? (
                        <Link to={`/listings/${row.accommodation._id || row.accommodation}`}>
                          {row.accommodation.title}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{row.accommodation?.location || "—"}</td>
                    {isHost && (
                      <td>
                        {row.user?.username || row.user?.email || "—"}
                      </td>
                    )}
                    <td>{formatDate(row.checkIn)}</td>
                    <td>{formatDate(row.checkOut)}</td>
                    <td>{row.guests}</td>
                    <td>{row.nights}</td>
                    <td>R{row.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
      <CopyrightFooter />
    </div>
  );
}
