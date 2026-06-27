import { listingImageUrl, onListingImageError } from "../api/client";
import "./ListingGallery.css";

/**
 * Image gallery — large image left, four thumbnails in a 2×2 grid on the right.
 */
export default function ListingGallery({ images = [], title }) {
  const main = images[0] || null;
  const thumbs = Array.from({ length: 4 }, (_, i) => images[i + 1] || images[0] || null);

  return (
    <div className="listing-gallery">
      <div className="listing-gallery__main">
        <img
          src={listingImageUrl(main, 0)}
          alt={title}
          loading="eager"
          onError={(e) => onListingImageError(e, 0)}
        />
      </div>
      <div className="listing-gallery__grid">
        {thumbs.map((img, index) => (
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
