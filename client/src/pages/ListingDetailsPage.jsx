import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CopyrightFooter from "../components/CopyrightFooter";
import ListingGallery from "../components/ListingGallery";
import ListingDetailsInfo from "../components/ListingDetailsInfo";
import BookingPanel from "../components/BookingPanel";
import { apiGet } from "../api/client";
import "./ListingDetailsPage.css";

/**
 * Location Details page — gallery, static info, booking panel (calculator Day 17).
 */
export default function ListingDetailsPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    apiGet(`/api/accommodations/${id}`)
      .then((data) => setListing(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="listing-details">
      <Header locationValue={listing?.location || "Centurion"} />

      <main className="listing-details__main">
        {loading && <p className="listing-details__message">Loading listing…</p>}
        {error && (
          <p className="listing-details__error">
            {error}. <Link to="/locations?location=Centurion">Back to Centurion stays</Link>
          </p>
        )}

        {!loading && !error && listing && (
          <>
            <header className="listing-details__header">
              <h1>
                {listing.type} in {listing.location}
              </h1>
              <p className="listing-details__subheading">{listing.title}</p>
              <p className="listing-details__meta">
                {listing.rating > 0 ? (
                  <>
                    <span>★ {listing.rating}</span>
                    <span> · </span>
                    <span>{listing.reviews} reviews</span>
                    <span> · </span>
                  </>
                ) : null}
                <span>{listing.location}, South Africa</span>
              </p>
            </header>

            <ListingGallery images={listing.images} title={listing.title} />

            <div className="listing-details__columns">
              <div className="listing-details__left">
                <ListingDetailsInfo listing={listing} />
              </div>
              <div className="listing-details__right">
                <BookingPanel listing={listing} />
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
      <CopyrightFooter />
    </div>
  );
}
