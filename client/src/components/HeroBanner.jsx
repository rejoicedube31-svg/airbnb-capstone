import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HeroBanner.css";

function defaultCheckIn() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function defaultCheckOut() {
  const d = new Date();
  d.setDate(d.getDate() + 8);
  return d.toISOString().slice(0, 10);
}

function formatGuestSummary(adults, children) {
  const total = adults + children;
  return `${total} guest${total === 1 ? "" : "s"}`;
}

function formatDisplayDate(value) {
  if (!value) return "";
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const LOCATION_OPTIONS = [
  { value: "", label: "Select a Location" },
  { value: "all", label: "All Locations" },
  { value: "New York", label: "New York" },
  { value: "Paris", label: "Paris" },
  { value: "Tokyo", label: "Tokyo" },
  { value: "Cape Town", label: "Cape Town" },
  { value: "Phuket", label: "Phuket" },
];

function HeroDateField({ label, value, onChange, min }) {
  const inputRef = useRef(null);

  function openPicker() {
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  }

  return (
    <div className="hero__field hero__field--date" onClick={openPicker} onKeyDown={(e) => e.key === "Enter" && openPicker()} role="button" tabIndex={0}>
      <span className="hero__label">{label}</span>
      <div className="hero__date-wrap">
        <span className={value ? "hero__date-display" : "hero__placeholder"}>
          {value ? formatDisplayDate(value) : "Select date"}
        </span>
        <input
          ref={inputRef}
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="hero__date-input"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

function GuestStepper({ label, value, onDecrease, onIncrease, min = 0, max = 16 }) {
  return (
    <div className="hero__guest-row">
      <span className="hero__guest-row-label">{label}</span>
      <div className="hero__guest-stepper">
        <button
          type="button"
          className="hero__guest-step-btn"
          onClick={onDecrease}
          disabled={value <= min}
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          −
        </button>
        <span className="hero__guest-count">{value}</span>
        <button
          type="button"
          className="hero__guest-step-btn"
          onClick={onIncrease}
          disabled={value >= max}
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

/**
 * Video-guide hero — black header, floating search pill, full-bleed image, "I'm flexible" CTA.
 */
export default function HeroBanner() {
  const navigate = useNavigate();
  const guestRef = useRef(null);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [guestsOpen, setGuestsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (guestRef.current && !guestRef.current.contains(event.target)) {
        setGuestsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function buildLocationsUrl(selectedLocation) {
    const resolvedCheckIn = checkIn || defaultCheckIn();
    const resolvedCheckOut = checkOut || defaultCheckOut();
    const totalGuests = Math.max(1, adults + children);

    const params = new URLSearchParams({
      checkIn: resolvedCheckIn,
      checkOut: resolvedCheckOut,
      guests: String(totalGuests),
    });

    if (selectedLocation === "all") {
      params.set("location", "all");
    } else if (selectedLocation.trim()) {
      params.set("location", selectedLocation.trim());
    } else {
      params.set("location", "Cape Town");
    }

    return `/locations?${params.toString()}`;
  }

  function handleLocationChange(event) {
    const value = event.target.value;
    setLocation(value);

    if (value === "all") {
      navigate(buildLocationsUrl("all"));
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    setGuestsOpen(false);
    navigate(buildLocationsUrl(location));
  }

  const guestMax = 16;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="hero">
      <form className="hero__search" onSubmit={handleSearch}>
        <label className="hero__field hero__field--location">
          <span className="hero__label">Locations</span>
          <select
            className={`hero__location-select${location ? "" : " hero__location-select--placeholder"}`}
            value={location}
            onChange={handleLocationChange}
            aria-label="Locations"
          >
            {LOCATION_OPTIONS.map((option) => (
              <option key={option.value || "placeholder"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <HeroDateField
          label="Check in date"
          value={checkIn}
          min={today}
          onChange={setCheckIn}
        />

        <HeroDateField
          label="Checkout date"
          value={checkOut}
          min={checkIn || today}
          onChange={setCheckOut}
        />

        <div
          className={`hero__field hero__field--guests${guestsOpen ? " hero__field--guests-open" : ""}`}
          ref={guestRef}
        >
          <button
            type="button"
            className="hero__guest-trigger"
            onClick={() => setGuestsOpen((open) => !open)}
            aria-expanded={guestsOpen}
            aria-haspopup="dialog"
          >
            <span className="hero__label">Guests</span>
            <span className="hero__guest-value">{formatGuestSummary(adults, children)}</span>
          </button>

          {guestsOpen && (
            <div className="hero__guest-menu" role="dialog" aria-label="Guests">
              <GuestStepper
                label="Adults"
                value={adults}
                min={0}
                max={guestMax - children}
                onDecrease={() => setAdults((count) => Math.max(0, count - 1))}
                onIncrease={() =>
                  setAdults((count) => Math.min(guestMax - children, count + 1))
                }
              />
              <GuestStepper
                label="Children"
                value={children}
                min={0}
                max={guestMax - adults}
                onDecrease={() => setChildren((count) => Math.max(0, count - 1))}
                onIncrease={() =>
                  setChildren((count) => Math.min(guestMax - adults, count + 1))
                }
              />
            </div>
          )}
        </div>

        <button type="submit" className="hero__search-btn" aria-label="Search stays">
          <svg width="16" height="16" viewBox="0 0 32 32" aria-hidden="true">
            <path
              fill="currentColor"
              d="M13 4a9 9 0 105.293 15.293l7.707 7.707 1.414-1.414-7.707-7.707A9 9 0 0013 4zm0 2a7 7 0 110 14 7 7 0 010-14z"
            />
          </svg>
        </button>
      </form>

      <div className="hero__bottom">
        <h2 className="hero__tagline">Not sure where to go? Perfect.</h2>
        <Link to="/locations?location=Cape Town" className="hero__flexible">
          I&apos;m flexible
        </Link>
      </div>
    </section>
  );
}
