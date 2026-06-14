import { listingImageUrl, onListingImageError } from "../api/client";
import "./ListingGallery.css";

/**
 * Image gallery — large image left, four smaller images in a 2×2 grid on the right.
 */
export default function ListingGallery({ images = [], title }) {
  const slots = Array.from({ length: 5 }, (_, i) => images[i] || null);

  return (
    <div className="listing-gallery">
      <div className="listing-gallery__main">
        <img
          src={listingImageUrl(slots[0], 0)}
          alt={title}
          loading="eager"
          onError={(e) => onListingImageError(e, 0)}
        />
      </div>
      <div className="listing-gallery__grid">
        {slots.slice(1).map((img, index) => (
          <div key={index} className="listing-gallery__thumb">
            <img
              src={listingImageUrl(img, index + 1)}
              alt=""
              loading="lazy"
              onError={(e) => onListingImageError(e, index + 1)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
