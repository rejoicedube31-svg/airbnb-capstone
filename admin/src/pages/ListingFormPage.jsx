import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSubNav from "../components/AdminSubNav";
import {
  createListing,
  fetchListing,
  imageUrl,
  updateListing,
  uploadListingImage,
} from "../api/client";
import "./AdminPage.css";
import "./ListingFormPage.css";

const LOCATION_OPTIONS = ["Cape Town", "New York", "Paris", "Tokyo", "Phuket"];

const TYPE_OPTIONS = [
  { value: "", label: "Select an option" },
  { value: "Entire Unit", label: "Entire Unit" },
  { value: "Room", label: "Room" },
  { value: "Whole Villa", label: "Whole Villa" },
];

function buildTypeOptions(currentType) {
  const options = [...TYPE_OPTIONS];
  if (currentType && !options.some((item) => item.value === currentType)) {
    options.push({ value: currentType, label: currentType });
  }
  return options;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "",
  location: "",
  guests: 0,
  bedrooms: 0,
  bathrooms: 0,
  amenities: [],
  images: [],
  price: 0,
  weeklyDiscount: 0,
  cleaningFee: 50,
  serviceFee: 50,
  occupancyTaxes: 30,
  enhancedCleaning: true,
  selfCheckIn: false,
};

function listingToForm(listing) {
  return {
    title: listing.title || "",
    description: listing.description || "",
    type: listing.type || "",
    location: listing.location || "",
    guests: listing.guests ?? 0,
    bedrooms: listing.bedrooms ?? 0,
    bathrooms: listing.bathrooms ?? 0,
    amenities: listing.amenities || [],
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
    type: form.type.trim() || "Entire Unit",
    location: form.location.trim(),
    guests: Math.max(1, Number(form.guests) || 1),
    bedrooms: Math.max(0, Number(form.bedrooms) || 0),
    bathrooms: Math.max(0, Number(form.bathrooms) || 0),
    amenities: form.amenities,
    images: form.images,
    price: Number(form.price) || 0,
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
  const [amenityDraft, setAmenityDraft] = useState("");
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

  function addAmenity() {
    const trimmed = amenityDraft.trim();
    if (!trimmed) return;

    setForm((current) => ({
      ...current,
      amenities: current.amenities.includes(trimmed)
        ? current.amenities
        : [...current.amenities, trimmed],
    }));
    setAmenityDraft("");
  }

  function removeAmenity(item) {
    setForm((current) => ({
      ...current,
      amenities: current.amenities.filter((entry) => entry !== item),
    }));
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

    if (!form.location.trim()) {
      setError("Please select a location.");
      setSaving(false);
      return;
    }

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
      <AdminSubNav />
      <main className="admin-page listing-form-page">
        {loading ? (
          <p className="admin-page__muted listing-form-page__status">Loading listing…</p>
        ) : (
          <form className="listing-form" onSubmit={handleSubmit}>
            <header className="listing-form__heading">
              <h1>{isEdit ? "Update Listing" : "Create Listing"}</h1>
            </header>

            <div className="listing-form__columns">
              <div className="listing-form__col listing-form__col--left">
                <label className="listing-form__field">
                  Listing Title
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="My Home"
                    required
                  />
                </label>

                <label className="listing-form__field">
                  Location
                  <select
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    required
                  >
                    <option value="">Select a location</option>
                    {LOCATION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="listing-form__field">
                  Description
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={8}
                    required
                  />
                </label>

                <div className="listing-form__checks">
                  <label className="listing-form__check">
                    <input
                      type="checkbox"
                      checked={form.enhancedCleaning}
                      onChange={(e) => updateField("enhancedCleaning", e.target.checked)}
                    />
                    Enhanced Cleaning
                  </label>
                  <label className="listing-form__check">
                    <input
                      type="checkbox"
                      checked={form.selfCheckIn}
                      onChange={(e) => updateField("selfCheckIn", e.target.checked)}
                    />
                    Self Check-In
                  </label>
                </div>

                <div className="listing-form__field">
                  <span className="listing-form__label">Amenities</span>
                  <div className="listing-form__amenity-row">
                    <input
                      value={amenityDraft}
                      onChange={(e) => setAmenityDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addAmenity();
                        }
                      }}
                      placeholder="wifi"
                    />
                    <button type="button" className="listing-form__add-btn" onClick={addAmenity}>
                      Add
                    </button>
                  </div>
                  {form.amenities.length > 0 && (
                    <ul className="listing-form__amenity-list">
                      {form.amenities.map((item) => (
                        <li key={item}>
                          {item}
                          <button type="button" onClick={() => removeAmenity(item)}>
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="listing-form__col listing-form__col--right">
                <div className="listing-form__row listing-form__row--two">
                  <label className="listing-form__field listing-form__field--price">
                    Price
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      required
                    />
                  </label>
                  <div className="listing-form__field listing-form__field--type">
                    <label className="listing-form__label" htmlFor="listing-type">
                      Type
                    </label>
                    <div className="listing-form__select-wrap">
                      <select
                        id="listing-type"
                        value={form.type}
                        onChange={(e) => updateField("type", e.target.value)}
                        required
                      >
                        {buildTypeOptions(form.type).map((option) => (
                          <option key={option.value || "placeholder"} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="listing-form__row listing-form__row--three">
                  <label className="listing-form__field">
                    Guests
                    <input
                      type="number"
                      min="0"
                      value={form.guests}
                      onChange={(e) => updateField("guests", e.target.value)}
                      required
                    />
                  </label>
                  <label className="listing-form__field">
                    Bedrooms
                    <input
                      type="number"
                      min="0"
                      value={form.bedrooms}
                      onChange={(e) => updateField("bedrooms", e.target.value)}
                      required
                    />
                  </label>
                  <label className="listing-form__field">
                    Bathrooms
                    <input
                      type="number"
                      min="0"
                      value={form.bathrooms}
                      onChange={(e) => updateField("bathrooms", e.target.value)}
                      required
                    />
                  </label>
                </div>

                <div className="listing-form__upload-block">
                  <label className="listing-form__upload-btn">
                    {uploading ? "Uploading…" : "Upload Images"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>

                  <div className="listing-form__image-panel">
                    {form.images.length === 0 ? (
                      <p className="listing-form__image-empty">No images uploaded</p>
                    ) : (
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
                  </div>
                </div>

                {error && (
                  <p className="admin-page__error listing-form__error" role="alert">
                    {error}
                  </p>
                )}

                <div className="listing-form__actions">
                  <button
                    type="submit"
                    className="listing-form__create-btn"
                    disabled={saving || uploading}
                  >
                    {saving ? "Saving…" : isEdit ? "Update" : "Create"}
                  </button>
                  <Link to="/listings" className="listing-form__cancel-btn">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
