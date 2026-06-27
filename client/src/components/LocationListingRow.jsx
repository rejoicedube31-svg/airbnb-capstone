import { Link } from "react-router-dom";
import { listingImageUrl, onListingImageError } from "../api/client";
import "./LocationListingRow.css";

export default function LocationListingRow({ listing, searchQuery = "" }) {
  const imgSrc = listingImageUrl(listing.images?.[0], 0);
  const amenities = listing.amenities?.slice(0, 4).join(" · ") || "No amenities listed";
  const listingUrl = searchQuery
    ? `/listings/${listing._id}?${searchQuery}`
    : `/listings/${listing._id}`;

  const specs = [
    listing.guests ? `${listing.guests} guest${listing.guests === 1 ? "" : "s"}` : null,
    listing.bedrooms ? `${listing.bedrooms} bedroom${listing.bedrooms === 1 ? "" : "s"}` : null,
    listing.bathrooms ? `${listing.bathrooms} bath${listing.bathrooms === 1 ? "" : "s"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link to={listingUrl} className="location-row">
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
        {listing.location && (
          <p className="location-row__location">{listing.location}</p>
        )}
        {specs && <p className="location-row__specs">{specs}</p>}
        <p className="location-row__amenities">{amenities}</p>
        <div className="location-row__footer">
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
          <p className="location-row__price">
            <strong>R{listing.price}</strong> <span>/ night</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
