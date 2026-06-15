import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  apiPost,
  calculateBookingTotal,
  calculateNights,
  getToken,
  loginUser,
} from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./BookingPanel.css";

function defaultCheckIn() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function defaultCheckOut() {
  const d = new Date();
  d.setDate(d.getDate() + 8);
  return d.toISOString().slice(0, 10);
}

/**
 * Cost calculator + Reserve — saves booking to MongoDB via JWT.
 * Why: Brief requires dynamic price breakdown and reservation on Location Details.
 */
export default function BookingPanel({ listing }) {
  const { user, isLoggedIn, setAuth, logout } = useAuth();
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(1);
  const [showLogin, setShowLogin] = useState(!isLoggedIn);
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("password123");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setShowLogin(!isLoggedIn);
  }, [isLoggedIn]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return calculateNights(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const costs = useMemo(() => {
    if (nights < 1) return { subtotal: 0, total: 0 };
    return calculateBookingTotal(listing, nights);
  }, [listing, nights]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setStatus("");

    try {
      const data = await loginUser(email, password);
      setAuth(data.token, data.user);
      setShowLogin(false);
      setStatus(`Logged in as ${data.user.username}`);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    logout();
    setShowLogin(true);
    setStatus("");
  }

  async function handleReserve() {
    setError("");
    setStatus("");

    if (!getToken()) {
      setShowLogin(true);
      setError("Please log in to reserve.");
      return;
    }

    if (nights < 1) {
      setError("Check-out must be after check-in.");
      return;
    }

    if (guests > listing.guests) {
      setError(`Maximum ${listing.guests} guests for this listing.`);
      return;
    }

    setSubmitting(true);

    try {
      await apiPost(
        "/api/reservations",
        {
          accommodation: listing._id,
          checkIn,
          checkOut,
          guests: Number(guests),
        },
        true
      );
      setStatus("Reservation confirmed! Saved to MongoDB.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside className="booking-panel">
      <div className="booking-panel__card">
        <p className="booking-panel__price">
          <strong>R{listing.price}</strong> <span>night</span>
        </p>

        <div className="booking-panel__dates">
          <label>
            Check-in
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </label>
          <label>
            Check-out
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </label>
        </div>

        <label className="booking-panel__guests">
          Guests
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {Array.from({ length: listing.guests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} guest{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>

        {nights >= 1 ? (
          <div className="booking-panel__breakdown">
            <div className="booking-panel__line">
              <span>
                R{listing.price} × {nights} night{nights === 1 ? "" : "s"}
              </span>
              <span>R{costs.subtotal}</span>
            </div>
            {listing.weeklyDiscount > 0 && (
              <div className="booking-panel__line booking-panel__line--discount">
                <span>Weekly discount</span>
                <span>−R{listing.weeklyDiscount}</span>
              </div>
            )}
            {listing.cleaningFee > 0 && (
              <div className="booking-panel__line">
                <span>Cleaning fee</span>
                <span>R{listing.cleaningFee}</span>
              </div>
            )}
            {listing.serviceFee > 0 && (
              <div className="booking-panel__line">
                <span>Service fee</span>
                <span>R{listing.serviceFee}</span>
              </div>
            )}
            {listing.occupancyTaxes > 0 && (
              <div className="booking-panel__line">
                <span>Occupancy taxes and fees</span>
                <span>R{listing.occupancyTaxes}</span>
              </div>
            )}
            <div className="booking-panel__line booking-panel__total">
              <span>Total</span>
              <span>R{costs.total}</span>
            </div>
          </div>
        ) : (
          <p className="booking-panel__invalid">Choose valid check-in and check-out dates.</p>
        )}

        {user && !showLogin && (
          <p className="booking-panel__user">
            Booking as <strong>{user.username}</strong>{" "}
            <button type="button" className="booking-panel__link" onClick={handleLogout}>
              Log out
            </button>
            {" · "}
            <Link to="/reservations" className="booking-panel__link">
              View reservations
            </Link>
          </p>
        )}

        {showLogin && (
          <form className="booking-panel__login" onSubmit={handleLogin}>
            <p className="booking-panel__login-title">Log in to reserve</p>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="booking-panel__login-btn">
              Log in
            </button>
            <p className="booking-panel__hint">Demo: john@example.com / password123</p>
          </form>
        )}

        {error && <p className="booking-panel__error">{error}</p>}
        {status && <p className="booking-panel__success">{status}</p>}

        <button
          type="button"
          className="booking-panel__btn"
          onClick={handleReserve}
          disabled={submitting || nights < 1}
        >
          {submitting ? "Reserving…" : "Reserve"}
        </button>
      </div>
    </aside>
  );
}
