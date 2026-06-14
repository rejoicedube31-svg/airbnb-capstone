import { Link } from "react-router-dom";
import { listingImageUrl, onListingImageError } from "../api/client";
import "./LocationListingRow.css";

export default function LocationListingRow({ listing }) {
  const imgSrc = listingImageUrl(listing.images?.[0], 0);
  const amenities = listing.amenities?.slice(0, 4).join(" · ") || "No amenities listed";

  return (
    <Link to={`/listings/${listing._id}`} className="location-row">
      <div className="location-row__image">
        <img
          src={imgSrc}
          alt={listing.title}
          onError={(e) => onListingImageError(e, 0)}
        />
      </div>
      <div className="location-row__details">
        <p className="location-row__type">{listing.type}</p>
        <h2 className="location-row__title">{listing.title}</h2>
        <p className="location-row__amenities">{amenities}</p>
        <div className="location-row__meta">
          {listing.rating > 0 ? (
            <span className="location-row__rating">
              ★ {listing.rating}
              {listing.reviews > 0 && (
                <span className="location-row__reviews"> ({listing.reviews} reviews)</span>
              )}
            </span>
          ) : (
            <span className="location-row__rating location-row__rating--new">New listing</span>
          )}
        </div>
        <p className="location-row__price">
          <strong>R{listing.price}</strong> <span>per night</span>
        </p>
      </div>
    </Link>
  );
}
