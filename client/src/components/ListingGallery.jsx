import { imageUrl } from "../api/client";
import "./ListingGallery.css";

const FALLBACK =
  "https://images.unsplash.com/photo-1580060839134-75a3eade3bf6?auto=format&fit=crop&w=1200&q=80";

/**
 * Image gallery — large image left, four smaller images in a 2×2 grid on the right.
 * Why: Brief specifies this exact layout on the Location Details page.
 */
export default function ListingGallery({ images = [], title }) {
  const slots = Array.from({ length: 5 }, (_, i) => images[i] || null);
  const [main, ...thumbs] = slots;

  function src(path) {
    return path ? imageUrl(path) : FALLBACK;
  }

  return (
    <div className="listing-gallery">
      <div className="listing-gallery__main">
        <img
          src={src(main)}
          alt={title}
          onError={(e) => {
            e.currentTarget.src = FALLBACK;
          }}
        />
      </div>
      <div className="listing-gallery__grid">
        {thumbs.map((img, index) => (
          <div key={index} className="listing-gallery__thumb">
            <img
              src={src(img)}
              alt=""
              onError={(e) => {
                e.currentTarget.src = FALLBACK;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
