import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import {
  createListing,
  fetchListing,
  imageUrl,
  updateListing,
  uploadListingImage,
} from "../api/client";
import "./AdminPage.css";
import "./ListingFormPage.css";

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "Entire apartment",
  location: "Centurion",
  guests: 2,
  bedrooms: 1,
  bathrooms: 1,
  amenities: "wifi, kitchen, free parking",
  images: [],
  price: 500,
  weeklyDiscount: 0,
  cleaningFee: 50,
  serviceFee: 50,
  occupancyTaxes: 30,
  enhancedCleaning: false,
  selfCheckIn: false,
};

function listingToForm(listing) {
  return {
    title: listing.title || "",
    description: listing.description || "",
    type: listing.type || "Entire apartment",
    location: listing.location || "Centurion",
    guests: listing.guests ?? 2,
    bedrooms: listing.bedrooms ?? 1,
    bathrooms: listing.bathrooms ?? 1,
    amenities: (listing.amenities || []).join(", "),
    images: listing.images || [],
    price: listing.price ?? 0,
    weeklyDiscount: listing.weeklyDiscount ?? 0,
    cleaningFee: listing.cleaningFee ?? 0,
    serviceFee: listing.serviceFee ?? 0,
    occupancyTaxes: listing.occupancyTaxes ?? 0,
    enhancedCleaning: Boolean(listing.enhancedCleaning),
    selfCheckIn: Boolean(listing.selfCheckIn),
  };
}

function formToPayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    type: form.type.trim(),
    location: form.location.trim(),
    guests: Number(form.guests),
    bedrooms: Number(form.bedrooms),
    bathrooms: Number(form.bathrooms),
    amenities: form.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    images: form.images,
    price: Number(form.price),
    weeklyDiscount: Number(form.weeklyDiscount) || 0,
    cleaningFee: Number(form.cleaningFee) || 0,
    serviceFee: Number(form.serviceFee) || 0,
    occupancyTaxes: Number(form.occupancyTaxes) || 0,
    enhancedCleaning: form.enhancedCleaning,
    selfCheckIn: form.selfCheckIn,
  };
}

export default function ListingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const listing = await fetchListing(id);
        setForm(listingToForm(listing));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, isEdit]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const data = await uploadListingImage(file);
      setForm((current) => ({
        ...current,
        images: [...current.images, data.url],
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeImage(index) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = formToPayload(form);

      if (isEdit) {
        await updateListing(id, payload);
      } else {
        await createListing(payload);
      }

      navigate("/listings", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-app">
      <AdminHeader />
      <main className="admin-page listing-form-page">
        <div className="admin-page__header">
          <div>
            <p className="admin-page__eyebrow">{isEdit ? "Edit listing" : "New listing"}</p>
            <h1>{isEdit ? "Update listing" : "Create listing"}</h1>
            <p className="admin-page__lead">
              Fill in the details guests will see on the public site.
            </p>
          </div>
          <Link to="/listings" className="admin-page__secondary-btn">
            ← Back to listings
          </Link>
        </div>

        {loading ? (
          <p className="admin-page__muted">Loading listing…</p>
        ) : (
          <form className="listing-form" onSubmit={handleSubmit}>
            <section className="listing-form__section">
              <h2>Basics</h2>
              <div className="listing-form__grid">
                <label>
                  Title
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    required
                  />
                </label>
                <label>
                  Type
                  <input
                    value={form.type}
                    onChange={(e) => updateField("type", e.target.value)}
                    required
                  />
                </label>
                <label>
                  Location
                  <input
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    required
                  />
                </label>
                <label className="listing-form__full">
                  Description
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={4}
                    required
                  />
                </label>
              </div>
            </section>

            <section className="listing-form__section">
              <h2>Property details</h2>
              <div className="listing-form__grid">
                <label>
                  Guests
                  <input
                    type="number"
                    min="1"
                    value={form.guests}
                    onChange={(e) => updateField("guests", e.target.value)}
                    required
                  />
                </label>
                <label>
                  Bedrooms
                  <input
                    type="number"
                    min="0"
                    value={form.bedrooms}
                    onChange={(e) => updateField("bedrooms", e.target.value)}
                    required
                  />
                </label>
                <label>
                  Bathrooms
                  <input
                    type="number"
                    min="0"
                    value={form.bathrooms}
                    onChange={(e) => updateField("bathrooms", e.target.value)}
                    required
                  />
                </label>
                <label className="listing-form__full">
                  Amenities (comma separated)
                  <input
                    value={form.amenities}
                    onChange={(e) => updateField("amenities", e.target.value)}
                  />
                </label>
              </div>
            </section>

            <section className="listing-form__section">
              <h2>Pricing (ZAR)</h2>
              <div className="listing-form__grid">
                <label>
                  Price per night
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    required
                  />
                </label>
                <label>
                  Weekly discount
                  <input
                    type="number"
                    min="0"
                    value={form.weeklyDiscount}
                    onChange={(e) => updateField("weeklyDiscount", e.target.value)}
                  />
                </label>
                <label>
                  Cleaning fee
                  <input
                    type="number"
                    min="0"
                    value={form.cleaningFee}
                    onChange={(e) => updateField("cleaningFee", e.target.value)}
                  />
                </label>
                <label>
                  Service fee
                  <input
                    type="number"
                    min="0"
                    value={form.serviceFee}
                    onChange={(e) => updateField("serviceFee", e.target.value)}
                  />
                </label>
                <label>
                  Occupancy taxes
                  <input
                    type="number"
                    min="0"
                    value={form.occupancyTaxes}
                    onChange={(e) => updateField("occupancyTaxes", e.target.value)}
                  />
                </label>
              </div>
            </section>

            <section className="listing-form__section">
              <h2>Options</h2>
              <div className="listing-form__checks">
                <label>
                  <input
                    type="checkbox"
                    checked={form.enhancedCleaning}
                    onChange={(e) => updateField("enhancedCleaning", e.target.checked)}
                  />
                  Enhanced cleaning
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.selfCheckIn}
                    onChange={(e) => updateField("selfCheckIn", e.target.checked)}
                  />
                  Self check-in
                </label>
              </div>
            </section>

            <section className="listing-form__section">
              <h2>Photos</h2>
              <p className="listing-form__hint">
                Upload images to the server, then save the listing. Uploaded files appear below.
              </p>
              <label className="listing-form__upload">
                <span>{uploading ? "Uploading…" : "Choose image"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>

              {form.images.length > 0 && (
                <div className="listing-form__images">
                  {form.images.map((path, index) => (
                    <figure key={`${path}-${index}`} className="listing-form__image-card">
                      <img src={imageUrl(path)} alt={`Listing ${index + 1}`} />
                      <button type="button" onClick={() => removeImage(index)}>
                        Remove
                      </button>
                    </figure>
                  ))}
                </div>
              )}
            </section>

            {error && <p className="admin-page__error" role="alert">{error}</p>}

            <div className="listing-form__actions">
              <button type="submit" className="admin-page__primary-btn" disabled={saving || uploading}>
                {saving ? "Saving…" : isEdit ? "Save changes" : "Create listing"}
              </button>
              <Link to="/listings" className="admin-page__secondary-btn">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
