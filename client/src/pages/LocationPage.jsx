import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import LocationListingRow from "../components/LocationListingRow";
import { apiGet } from "../api/client";
import "./LocationPage.css";

const DEFAULT_LOCATION = "Cape Town";

const LOCATION_SUBTITLES = {
  "Cape Town": "Cape Town, Western Cape, South Africa",
  "New York": "New York, USA",
  Paris: "Paris, France",
  Tokyo: "Tokyo, Japan",
  Phuket: "Phuket, Thailand",
};

function buildSearchParams(location, extra = {}) {
  const trimmed = location.trim();
  const normalized =
    trimmed.toLowerCase() === "all locations" || trimmed.toLowerCase() === "all"
      ? "all"
      : trimmed || DEFAULT_LOCATION;

  const params = { location: normalized };
  if (extra.checkIn) params.checkIn = extra.checkIn;
  if (extra.checkOut) params.checkOut = extra.checkOut;
  if (extra.guests) params.guests = extra.guests;
  return params;
}

export default function LocationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const locationParam = searchParams.get("location");
  const location =
    locationParam === "all" ? "all" : locationParam || DEFAULT_LOCATION;
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "";

  const [filterInput, setFilterInput] = useState(
    location === "all" ? "All Locations" : location
  );
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setFilterInput(location === "all" ? "All Locations" : location);
    setLoading(true);
    setError("");

    const endpoint =
      location === "all"
        ? "/api/accommodations"
        : `/api/accommodations?location=${encodeURIComponent(location)}`;

    apiGet(endpoint)
      .then((data) => setListings(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [location]);

  function handleFilterSubmit(event) {
    event.preventDefault();
    const trimmed = filterInput.trim();
    const nextLocation =
      trimmed.toLowerCase() === "all locations" || trimmed === ""
        ? "all"
        : trimmed || DEFAULT_LOCATION;
    setSearchParams(buildSearchParams(nextLocation === "all" ? "all" : nextLocation, { checkIn, checkOut, guests }));
  }

  function handleLocationSearch(value) {
    setSearchParams(buildSearchParams(value, { checkIn, checkOut, guests }));
  }

  const locationLabel = location === "all" ? "all locations" : location;
  const locationSubtitle =
    location === "all"
      ? "All available stays"
      : LOCATION_SUBTITLES[location] || `${location}`;

  const listingSearchQuery = searchParams.toString();

  return (
    <PageLayout
      headerProps={{
        locationValue: location === "all" ? "All Locations" : location,
        onLocationSearch: handleLocationSearch,
      }}
    >
      <main className="location-page__main">
        {(checkIn || checkOut || guests) && (
          <p className="location-page__search-summary">
            {checkIn && checkOut && (
              <span>
                {checkIn} → {checkOut}
              </span>
            )}
            {guests && <span>{guests} guest{Number(guests) === 1 ? "" : "s"}</span>}
          </p>
        )}
        <form className="location-page__filter" onSubmit={handleFilterSubmit}>
          <label htmlFor="location-filter">Location filter</label>
          <div className="location-page__filter-row">
            <input
              id="location-filter"
              type="text"
              value={filterInput}
              onChange={(e) => setFilterInput(e.target.value)}
              placeholder="e.g. Cape Town"
            />
            <button type="submit">Search</button>
          </div>
        </form>

        <header className="location-page__heading">
          {loading ? (
            <h1>Loading stays in {locationLabel}…</h1>
          ) : (
            <h1>
              {listings.length} accommodation{listings.length === 1 ? "" : "s"} in{" "}
              {locationLabel}
            </h1>
          )}
          <p>Stays in {locationSubtitle}</p>
        </header>

        {loading && <p className="location-page__message">Loading listings…</p>}
        {error && (
          <p className="location-page__error">
            Could not load listings — is the backend running? ({error})
          </p>
        )}

        {!loading && !error && listings.length === 0 && (
          <p className="location-page__message">
            No stays found in {locationLabel}. Try Cape Town or run npm run seed in backend.
          </p>
        )}

        <div className="location-page__list">
          {!loading &&
            !error &&
            listings.map((listing) => (
              <LocationListingRow
                key={listing._id}
                listing={listing}
                searchQuery={listingSearchQuery}
              />
            ))}
        </div>
      </main>
    </PageLayout>
  );
}
