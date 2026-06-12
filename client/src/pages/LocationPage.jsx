import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import LocationListingRow from "../components/LocationListingRow";
import { apiGet } from "../api/client";
import "./LocationPage.css";

const DEFAULT_LOCATION = "Centurion";

/**
 * Location page — filter, heading, horizontal listing cards from API.
 * Why: Brief requires a dedicated view when guests search a destination.
 */
export default function LocationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = searchParams.get("location") || DEFAULT_LOCATION;

  const [filterInput, setFilterInput] = useState(location);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setFilterInput(location);
    setLoading(true);
    setError("");

    apiGet(`/api/accommodations?location=${encodeURIComponent(location)}`)
      .then((data) => setListings(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [location]);

  function handleFilterSubmit(event) {
    event.preventDefault();
    const trimmed = filterInput.trim() || DEFAULT_LOCATION;
    setSearchParams({ location: trimmed });
  }

  return (
    <div className="location-page">
      <Header
        locationValue={location}
        onLocationSearch={(value) => setSearchParams({ location: value.trim() || DEFAULT_LOCATION })}
      />

      <main className="location-page__main">
        <form className="location-page__filter" onSubmit={handleFilterSubmit}>
          <label htmlFor="location-filter">Location filter</label>
          <div className="location-page__filter-row">
            <input
              id="location-filter"
              type="text"
              value={filterInput}
              onChange={(e) => setFilterInput(e.target.value)}
              placeholder="e.g. Centurion"
            />
            <button type="submit">Search</button>
          </div>
        </form>

        <header className="location-page__heading">
          <h1>
            {listings.length} accommodation{listings.length === 1 ? "" : "s"} in {location}
          </h1>
          <p>Stays in {location}, Gauteng, South Africa</p>
        </header>

        {loading && <p className="location-page__message">Loading listings…</p>}
        {error && (
          <p className="location-page__error">
            Could not load listings — is the backend running? ({error})
          </p>
        )}

        {!loading && !error && listings.length === 0 && (
          <p className="location-page__message">
            No stays found in {location}. Try Centurion or run npm run seed in backend.
          </p>
        )}

        <div className="location-page__list">
          {!loading &&
            !error &&
            listings.map((listing) => (
              <LocationListingRow key={listing._id} listing={listing} />
            ))}
        </div>
      </main>
    </div>
  );
}
