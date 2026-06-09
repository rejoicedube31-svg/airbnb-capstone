import { Link } from "react-router-dom";
import { imageUrl } from "../api/client";
import "./LocationCard.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580060839134-75a3eade3bf6?auto=format&fit=crop&w=800&q=80";

/**
 * One property card for the inspiration grid.
 * Why: Brief asks for location cards with appealing visuals on the Home page.
 */
export default function LocationCard({ listing }) {
  const mainImage = listing.images?.[0];
  const imgSrc = mainImage ? imageUrl(mainImage) : FALLBACK_IMAGE;

  return (
    <Link to={`/listings/${listing._id}`} className="location-card">
      <div className="location-card__image-wrap">
        <img
          src={imgSrc}
          alt={listing.title}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>
      <div className="location-card__body">
        <div className="location-card__meta">
          <span className="location-card__location">{listing.location}</span>
          {listing.rating > 0 && (
            <span className="location-card__rating">★ {listing.rating}</span>
          )}
        </div>
        <h3 className="location-card__title">{listing.title}</h3>
        <p className="location-card__type">{listing.type}</p>
        <p className="location-card__price">
          <strong>R{listing.price}</strong> <span>night</span>
        </p>
      </div>
    </Link>
  );
}
