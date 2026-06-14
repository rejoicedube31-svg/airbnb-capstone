import "./BookingPanel.css";

/**
 * Right column placeholder — full cost calculator on Day 17.
 * Why: Two-column layout is required now; calculator + Reserve come next.
 */
export default function BookingPanel({ listing }) {
  return (
    <aside className="booking-panel">
      <div className="booking-panel__card">
        <p className="booking-panel__price">
          <strong>R{listing.price}</strong> <span>night</span>
        </p>
        <p className="booking-panel__note">
          Cost calculator with dates, guests, fees, and Reserve button — Day 17.
        </p>
        <button type="button" className="booking-panel__btn" disabled>
          Reserve (coming Day 17)
        </button>
      </div>
    </aside>
  );
}
