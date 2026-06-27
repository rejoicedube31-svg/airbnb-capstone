import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSubNav from "../components/AdminSubNav";
import { deleteListing, fetchListings, imageUrl } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./AdminPage.css";
import "./ListingsPage.css";

function formatAmenities(list) {
  if (!list?.length) return "None listed";
  return list.slice(0, 3).join(", ");
}

export default function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function loadListings() {
    setLoading(true);
    setError("");

    try {
      const all = await fetchListings();
      const mine = all.filter((item) => String(item.hostId) === String(user?.id));
      setListings(mine);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, [user?.id]);

  async function handleDelete(listing) {
    const confirmed = window.confirm(`Delete "${listing.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(listing._id);
    setError("");

    try {
      await deleteListing(listing._id);
      setListings((current) => current.filter((item) => item._id !== listing._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-app">
      <AdminHeader />
      <AdminSubNav />
      <main className="admin-page listings-page">
        <header className="listings-page__heading">
          <h1>My Listings</h1>
        </header>

        {error && (
          <p className="admin-page__error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="admin-page__muted listings-page__status">Loading listings…</p>
        ) : listings.length === 0 ? (
          <div className="listings-page__empty">
            <p>You have no listings yet.</p>
            <Link to="/listings/new" className="admin-page__primary-btn">
              Create your first listing
            </Link>
          </div>
        ) : (
          <div className="listings-page__list">
            {listings.map((listing) => (
              <article key={listing._id} className="listings-page__card">
                <div className="listings-page__media">
                  <div className="listings-page__image">
                    <img
                      src={imageUrl(listing.images?.[0]) || "/favicon.svg"}
                      alt={listing.title}
                    />
                  </div>
                  <Link
                    to={`/listings/${listing._id}/edit`}
                    className="listings-page__update"
                  >
                    Update
                  </Link>
                  <button
                    type="button"
                    className="listings-page__delete"
                    onClick={() => handleDelete(listing)}
                    disabled={deletingId === listing._id}
                  >
                    {deletingId === listing._id ? "Deleting…" : "Delete"}
                  </button>
                </div>

                <div className="listings-page__details">
                  <p className="listings-page__meta">
                    {listing.type} - {listing.location}
                  </p>
                  <h2 className="listings-page__title">{listing.title}</h2>
                  <p className="listings-page__specs">
                    {listing.guests} guests - {listing.type} - {listing.bedrooms} bedroom
                    {listing.bedrooms === 1 ? "" : "s"} - {listing.bathrooms} bathroom
                    {listing.bathrooms === 1 ? "" : "s"}
                  </p>
                  <p className="listings-page__amenities">
                    Amenities: {formatAmenities(listing.amenities)}
                  </p>
                  <div className="listings-page__footer">
                    {listing.rating > 0 ? (
                      <span className="listings-page__rating">
                        ★ {listing.rating}
                        {listing.reviews > 0 && (
                          <span className="listings-page__reviews">
                            {" "}
                            ({listing.reviews} reviews)
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="listings-page__rating listings-page__rating--new">
                        New listing
                      </span>
                    )}
                    <p className="listings-page__price">
                      <strong>R{listing.price}</strong>/night
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
