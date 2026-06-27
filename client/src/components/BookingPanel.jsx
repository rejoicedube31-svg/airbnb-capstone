import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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

function formatPanelDate(value) {
  if (!value) return "Add date";
  const d = new Date(`${value}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

/**
 * Cost calculator + Reserve — video-aligned booking card.
 */
export default function BookingPanel({ listing }) {
  const [searchParams] = useSearchParams();
  const { user, isLoggedIn, setAuth, logout } = useAuth();
  const [checkIn, setCheckIn] = useState(() => searchParams.get("checkIn") || defaultCheckIn());
  const [checkOut, setCheckOut] = useState(() => searchParams.get("checkOut") || defaultCheckOut());
  const [guests, setGuests] = useState(() => {
    const fromUrl = Number(searchParams.get("guests"));
    if (fromUrl >= 1 && fromUrl <= listing.guests) return fromUrl;
    if (fromUrl >= 1) return Math.min(fromUrl, listing.guests);
    return 1;
  });
  const [showLogin, setShowLogin] = useState(!isLoggedIn);
  const [email, setEmail] = useState("jannie@example.com");
  const [password, setPassword] = useState("password123");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setShowLogin(!isLoggedIn);
  }, [isLoggedIn]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const n = calculateNights(checkIn, checkOut);
    return n > 0 ? n : 0;
  }, [checkIn, checkOut]);

  const costs = useMemo(() => {
    const effectiveNights = nights > 0 ? nights : 0;
    const { subtotal, total } = calculateBookingTotal(listing, effectiveNights);
    if (effectiveNights === 0) {
      const feesOnly =
        (listing.cleaningFee || 0) +
        (listing.serviceFee || 0) +
        (listing.occupancyTaxes || 0);
      return { subtotal: 0, total: feesOnly };
    }
    return { subtotal, total };
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
      window.alert("Reservation successful!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside className="booking-panel">
      <div className="booking-panel__card">
        <div className="booking-panel__header">
          <p className="booking-panel__price">
            <strong>R{listing.price}</strong> <span>/ night</span>
          </p>
          {listing.rating > 0 && (
            <p className="booking-panel__rating">
              ★ {listing.rating} <span>({listing.reviews})</span>
            </p>
          )}
        </div>

        <div className="booking-panel__fields">
          <div className="booking-panel__dates">
            <label>
              <span>Check-in</span>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <em>{formatPanelDate(checkIn)}</em>
            </label>
            <label>
              <span>Check-out</span>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
              <em>{formatPanelDate(checkOut)}</em>
            </label>
          </div>
          <label className="booking-panel__guests">
            <span>Guests</span>
            <em>
              {guests} guest{guests === 1 ? "" : "s"}
            </em>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {Array.from({ length: listing.guests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} guest{n === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          className="booking-panel__btn"
          onClick={handleReserve}
          disabled={submitting}
        >
          {submitting ? "Reserving…" : "Reserve"}
        </button>
        <p className="booking-panel__charge-note">You won&apos;t be charged yet</p>

        <div className="booking-panel__breakdown">
          <div className="booking-panel__line">
            <span>
              R{listing.price} × {nights} night{nights === 1 ? "" : "s"}
            </span>
            <span>R{costs.subtotal}</span>
          </div>
          <div className="booking-panel__line booking-panel__line--discount">
            <span>Weekly discount</span>
            <span>−R{listing.weeklyDiscount || 0}</span>
          </div>
          <div className="booking-panel__line">
            <span>Cleaning fee</span>
            <span>R{listing.cleaningFee || 0}</span>
          </div>
          <div className="booking-panel__line">
            <span>Service fee</span>
            <span>R{listing.serviceFee || 0}</span>
          </div>
          <div className="booking-panel__line">
            <span>Occupancy taxes and fees</span>
            <span>R{listing.occupancyTaxes || 0}</span>
          </div>
          <div className="booking-panel__line booking-panel__total">
            <span>Total</span>
            <span>R{costs.total}</span>
          </div>
        </div>

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
            <p className="booking-panel__hint">Demo: jannie@example.com / password123</p>
          </form>
        )}

        {error && <p className="booking-panel__error">{error}</p>}
        {status && <p className="booking-panel__success">{status}</p>}
      </div>
    </aside>
  );
}
