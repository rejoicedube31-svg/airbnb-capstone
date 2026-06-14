import "./ListingDetailsInfo.css";

/**
 * Static information sections — left column on listing details.
 * Why: Brief lists these blocks (sleep, amenities, reviews, host, policies).
 */
export default function ListingDetailsInfo({ listing }) {
  const nights = 7;
  const ratings = listing.specificRatings || {};

  return (
    <div className="listing-info">
      <section>
        <h2>About this place</h2>
        <p>{listing.description}</p>
        <p className="listing-info__stats">
          {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms}{" "}
          bathrooms
        </p>
      </section>

      <section>
        <h2>Where you&apos;ll sleep</h2>
        <div className="listing-info__sleep-card">
          <p className="listing-info__sleep-title">Bedroom 1</p>
          <p>1 queen bed · Shared spaces as listed</p>
        </div>
      </section>

      <section>
        <h2>What this place offers</h2>
        <ul className="listing-info__amenities">
          {listing.amenities?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {listing.enhancedCleaning && <p>✓ Enhanced cleaning</p>}
        {listing.selfCheckIn && <p>✓ Self check-in</p>}
      </section>

      <section>
        <h2>
          {nights} nights in {listing.location}
        </h2>
        <p>
          Plan a week in {listing.location}, Gauteng — close to Pretoria and Johannesburg.
        </p>
      </section>

      {listing.rating > 0 && (
        <section>
          <h2>Reviews</h2>
          <p className="listing-info__rating-headline">
            ★ {listing.rating} · {listing.reviews} reviews
          </p>
          <div className="listing-info__rating-grid">
            {Object.entries(ratings).map(([key, value]) => (
              <div key={key}>
                <span>{key}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>Meet your host</h2>
        <p className="listing-info__host">{listing.host}</p>
        <p>Experienced host in {listing.location}. Responds quickly to messages.</p>
      </section>

      <section>
        <h2>House rules, health &amp; safety, cancellation</h2>
        <ul className="listing-info__policies">
          <li>Check-in after 3:00 pm · Check-out before 11:00 am</li>
          <li>No smoking · No parties or events</li>
          <li>Enhanced cleaning procedures between stays</li>
          <li>Free cancellation within 48 hours of booking (demo policy)</li>
        </ul>
      </section>
    </div>
  );
}
