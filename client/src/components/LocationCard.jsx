import { Link } from "react-router-dom";
import { listingImageUrl, onListingImageError } from "../api/client";
import "./LocationCard.css";

export default function LocationCard({ listing }) {
  const imgSrc = listingImageUrl(listing.images?.[0], 0);

  return (
    <Link to={`/listings/${listing._id}`} className="location-card">
      <div className="location-card__image-wrap">
        <img
          src={imgSrc}
          alt={listing.title}
          onError={(e) => onListingImageError(e, 0)}
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
