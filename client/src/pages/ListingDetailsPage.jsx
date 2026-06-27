import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import ListingGallery from "../components/ListingGallery";
import ListingHostSummary from "../components/ListingHostSummary";
import ListingDetailsInfo from "../components/ListingDetailsInfo";
import BookingPanel from "../components/BookingPanel";
import { apiGet, calculateNights } from "../api/client";
import "./ListingDetailsPage.css";

export default function ListingDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const nights = useMemo(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    if (!checkIn || !checkOut) return 7;
    const n = calculateNights(checkIn, checkOut);
    return n > 0 ? n : 7;
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError("");

    apiGet(`/api/accommodations/${id}`)
      .then((data) => setListing(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <PageLayout headerProps={{ locationValue: listing?.location || "Cape Town" }}>
      <main className="listing-details__main">
        {loading && <p className="listing-details__message">Loading listing…</p>}
        {error && (
          <p className="listing-details__error">
            {error}. <Link to="/locations?location=Cape Town">Back to Cape Town stays</Link>
          </p>
        )}

        {!loading && !error && listing && (
          <>
            <header className="listing-details__top">
              <div>
                <h1 className="listing-details__title">{listing.title}</h1>
                <p className="listing-details__meta">
                  {listing.rating > 0 && (
                    <>
                      <span className="listing-details__rating">★ {listing.rating}</span>
                      <span> ({listing.reviews} reviews)</span>
                      <span> · </span>
                    </>
                  )}
                  <span>{listing.location}</span>
                </p>
              </div>
              <div className="listing-details__actions">
                <button type="button" className="listing-details__action">
                  Share
                </button>
                <button type="button" className="listing-details__action">
                  Save
                </button>
              </div>
            </header>

            <ListingGallery images={listing.images} title={listing.title} />

            <div className="listing-details__columns">
              <div className="listing-details__left">
                <ListingHostSummary listing={listing} />
                <ListingDetailsInfo listing={listing} nights={nights} />
              </div>
              <div className="listing-details__right">
                <BookingPanel listing={listing} />
              </div>
            </div>
          </>
        )}
      </main>
    </PageLayout>
  );
}
