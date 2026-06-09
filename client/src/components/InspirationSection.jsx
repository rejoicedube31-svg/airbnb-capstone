import LocationCard from "./LocationCard";
import "./InspirationSection.css";

/**
 * "Inspiration for your next trip" — grid of Centurion listings from the API.
 * Why: Brief requires location cards on the Home page (frontend rubric).
 */
export default function InspirationSection({ listings, loading, error }) {
  return (
    <section className="inspiration">
      <div className="inspiration__header">
        <h2>Inspiration for your next trip</h2>
        <p>Popular stays in Centurion and Gauteng — book local apartments and homes.</p>
      </div>

      {loading && <p className="inspiration__message">Loading stays…</p>}
      {error && <p className="inspiration__error">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <p className="inspiration__message">No Centurion listings yet. Run npm run seed in backend.</p>
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="inspiration__grid">
          {listings.map((listing) => (
            <LocationCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  );
}
