import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import { deleteListing, fetchListings, imageUrl } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./AdminPage.css";
import "./ListingsPage.css";

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
      <main className="admin-page listings-page">
        <div className="admin-page__header">
          <div>
            <p className="admin-page__eyebrow">Day 21</p>
            <h1>Your listings</h1>
            <p className="admin-page__lead">Create, edit, and remove accommodation listings in Centurion.</p>
          </div>
          <Link to="/listings/new" className="admin-page__primary-btn">
            + Add listing
          </Link>
        </div>

        {error && <p className="admin-page__error" role="alert">{error}</p>}

        {loading ? (
          <p className="admin-page__muted">Loading listings…</p>
        ) : listings.length === 0 ? (
          <div className="listings-page__empty">
            <p>You have no listings yet.</p>
            <Link to="/listings/new" className="admin-page__primary-btn">
              Create your first listing
            </Link>
          </div>
        ) : (
          <div className="listings-page__table-wrap">
            <table className="listings-page__table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Guests</th>
                  <th>Price / night</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, index) => (
                  <tr key={listing._id}>
                    <td>
                      <img
                        className="listings-page__thumb"
                        src={imageUrl(listing.images?.[0]) || "/favicon.svg"}
                        alt=""
                      />
                    </td>
                    <td>{listing.title}</td>
                    <td>{listing.location}</td>
                    <td>{listing.type}</td>
                    <td>{listing.guests}</td>
                    <td>R {listing.price}</td>
                    <td className="listings-page__actions">
                      <Link to={`/listings/${listing._id}/edit`}>Edit</Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(listing)}
                        disabled={deletingId === listing._id}
                      >
                        {deletingId === listing._id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
