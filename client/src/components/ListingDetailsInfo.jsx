import { listingImageUrl } from "../api/client";
import "./ListingDetailsInfo.css";

const AMENITY_ICONS = {
  wifi: "M12 3C7.03 3 3 4.79 3 7.25S7.03 11.5 12 11.5s9-2.29 9-4.75S16.97 3 12 3zm0 6.5c-3.59 0-6.5-1.12-6.5-2.5S8.41 4.5 12 4.5s6.5 1.12 6.5 2.5-2.91 2.5-6.5 2.5zm0 4c-4.42 0-8-1.34-8-3v2.25c0 2.46 4.03 4.25 8 4.25s8-1.79 8-4.25V10.5c0 1.66-3.58 3-8 3z",
  kitchen:
    "M8 3h8v2H8V3zm-2 4h12v2H6V7zm0 4h12v10H6V11zm2 2v6h8v-6H8z",
  pool: "M2 12h2v2H2v-2zm18 0h2v2h-2v-2zM6 14l2-8h8l2 8H6zm2 2v4h8v-4H8z",
  parking:
    "M5 3h14v18H5V3zm2 2v14h10V5H7zm2 2h6v2H9V7zm0 4h6v2H9v-2z",
  default:
    "M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-1 4h2v6h-2V8zm0 8h2v2h-2v-2z",
};

const EXTRA_AMENITIES = [
  "Garden view",
  "Free washer - in building",
  "Refrigerator",
  "Pets allowed",
  "Security cameras",
  "Central air conditioning",
  "Dryer",
  "Bicycles",
];

const SAMPLE_REVIEWS = [
  { name: "Alice", date: "March 2023", text: "Amazing place, very clean and well-located." },
  { name: "Dave", date: "December 2022", text: "Fantastic stay! The location is perfect." },
  { name: "Carol", date: "January 2023", text: "The apartment was exactly as described. Highly recommend." },
  { name: "Frank", date: "October 2022", text: "Excellent value for the price. Loved the neighborhood." },
];

const RATING_LABELS = [
  ["cleanliness", "Cleanliness"],
  ["communication", "Communication"],
  ["checkIn", "Check-in"],
  ["accuracy", "Accuracy"],
  ["location", "Location"],
  ["value", "Value"],
];

function amenityIconKey(label) {
  const lower = label.toLowerCase();
  if (lower.includes("wifi")) return "wifi";
  if (lower.includes("kitchen")) return "kitchen";
  if (lower.includes("pool") || lower.includes("parking")) {
    return lower.includes("parking") ? "parking" : "pool";
  }
  return "default";
}

function formatAmenity(label) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function AmenityIcon({ label }) {
  const key = amenityIconKey(label);
  return (
    <svg className="listing-info__amenity-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d={AMENITY_ICONS[key] || AMENITY_ICONS.default} />
    </svg>
  );
}

function RatingBar({ label, value }) {
  const score = Number(value) || 0;
  const width = `${(score / 5) * 100}%`;

  return (
    <div className="listing-info__rating-row">
      <span className="listing-info__rating-label">{label}</span>
      <div className="listing-info__rating-track">
        <div className="listing-info__rating-fill" style={{ width }} />
      </div>
      <span className="listing-info__rating-score">{score.toFixed(1)}</span>
    </div>
  );
}

/**
 * Static information sections — left column on listing details (video guide).
 */
export default function ListingDetailsInfo({ listing, nights = 7 }) {
  const ratings = listing.specificRatings || {};
  const amenityList = [
    ...new Set([
      ...(listing.amenities || []).map(formatAmenity),
      ...EXTRA_AMENITIES,
    ]),
  ].slice(0, 10);

  const totalAmenities = Math.max(amenityList.length + 27, 37);
  const hostInitial = listing.host?.charAt(0)?.toUpperCase() || "H";
  const sleepImage = listing.images?.[1] || "/images/listings/bedroom.jpg";

  return (
    <div className="listing-info">
      <section className="listing-info__section">
        <h2>Where you&apos;ll sleep</h2>
        <div className="listing-info__sleep-card">
          <img
            src={listingImageUrl(sleepImage, 1)}
            alt="Bedroom"
            className="listing-info__sleep-image"
          />
          <p className="listing-info__sleep-caption">Spacious bedroom with comfortable bed</p>
          <p className="listing-info__sleep-meta">
            Total bedrooms: {listing.bedrooms}
          </p>
        </div>
      </section>

      <section className="listing-info__section">
        <h2>What this place offers</h2>
        <ul className="listing-info__amenities">
          {amenityList.map((item) => (
            <li key={item}>
              <AmenityIcon label={item} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="listing-info__outline-btn">
          View all {totalAmenities} amenities
        </button>
      </section>

      <section className="listing-info__section">
        <h2>
          {nights} nights in {listing.location}
        </h2>
        <p className="listing-info__date-range">25/06/2026 – 01/07/2026</p>
        <div className="listing-info__calendars">
          <div className="listing-info__calendar">
            <p className="listing-info__calendar-label">Check-in</p>
            <div className="listing-info__calendar-grid" aria-hidden="true">
              {Array.from({ length: 35 }, (_, i) => (
                <span
                  key={`in-${i}`}
                  className={i === 24 ? "listing-info__day listing-info__day--active" : "listing-info__day"}
                >
                  {((i % 30) + 1) || ""}
                </span>
              ))}
            </div>
          </div>
          <div className="listing-info__calendar">
            <p className="listing-info__calendar-label">Check-out</p>
            <div className="listing-info__calendar-grid" aria-hidden="true">
              {Array.from({ length: 35 }, (_, i) => (
                <span
                  key={`out-${i}`}
                  className={i === 30 ? "listing-info__day listing-info__day--active" : "listing-info__day"}
                >
                  {((i % 30) + 1) || ""}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button type="button" className="listing-info__clear-dates">
          Clear dates
        </button>
      </section>

      {(listing.rating > 0 || listing.reviews > 0) && (
        <section className="listing-info__section">
          <p className="listing-info__rating-headline">
            ★ {listing.rating || "5.0"} · {listing.reviews || 7} reviews
          </p>
          <div className="listing-info__rating-bars">
            {RATING_LABELS.map(([key, label]) => (
              <RatingBar key={key} label={label} value={ratings[key] ?? listing.rating ?? 5} />
            ))}
          </div>
        </section>
      )}

      <section className="listing-info__section">
        <div className="listing-info__reviews">
          {SAMPLE_REVIEWS.map((review) => (
            <article key={review.name} className="listing-info__review">
              <div className="listing-info__review-head">
                <span className="listing-info__review-avatar" aria-hidden="true">
                  {review.name.charAt(0)}
                </span>
                <div>
                  <strong>{review.name}</strong>
                  <span className="listing-info__review-date">{review.date}</span>
                </div>
              </div>
              <p>{review.text}</p>
            </article>
          ))}
        </div>
        <button type="button" className="listing-info__outline-btn">
          Show all {listing.reviews || 12} reviews
        </button>
      </section>

      <section className="listing-info__section listing-info__host-block">
        <div className="listing-info__host-head">
          <span className="listing-info__host-avatar" aria-hidden="true">
            {hostInitial}
          </span>
          <div>
            <h2>Hosted by {listing.host}</h2>
            <p>Joined June 2024</p>
          </div>
        </div>
        <ul className="listing-info__host-stats">
          <li>★ {listing.reviews || 320} Reviews</li>
          <li>✓ Identity verified</li>
          <li>◎ Superhost</li>
        </ul>
        <p className="listing-info__superhost">
          <strong>{listing.host} is a Superhost</strong>
        </p>
        <p className="listing-info__superhost-desc">
          Superhosts are experienced, highly rated hosts who are committed to providing great
          stays for guests.
        </p>
        <p className="listing-info__response">Response rate: 100%</p>
        <p className="listing-info__response">Response time: within an hour</p>
        <button type="button" className="listing-info__outline-btn">
          Contact host
        </button>
        <p className="listing-info__safety">
          To protect your payment, never transfer money or communicate outside of the Airbnb
          website or app.
        </p>
      </section>

      <section className="listing-info__section listing-info__policies-wrap">
        <div className="listing-info__policies-grid">
          <div>
            <h3>House rules</h3>
            <ul>
              <li>Check-in: After 4:00 PM</li>
              <li>Checkout: 10:00 AM</li>
              <li>Self check-in with lockbox</li>
              <li>Not suitable for infants (under 2 years)</li>
              <li>No smoking</li>
              <li>No pets</li>
              <li>No parties or events</li>
            </ul>
          </div>
          <div>
            <h3>Health &amp; safety</h3>
            <ul>
              <li>Committed to Airbnb&apos;s enhanced cleaning process. Show more</li>
              <li>Airbnb&apos;s social-distancing and other COVID-19-related guidelines apply</li>
              <li>Carbon monoxide alarm</li>
              <li>Smoke alarm</li>
              <li>Security Deposit — if you damage the home, you may be charged up to R566</li>
            </ul>
          </div>
          <div>
            <h3>Cancellation policy</h3>
            <ul>
              <li>Free cancellation before Feb 14</li>
              <li>Show more</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
