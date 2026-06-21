import { Link } from "react-router-dom";
import { useState } from "react";
import { localPlaceholder } from "../api/client";
import "./InspirationSection.css";

const DESTINATIONS = [
  {
    city: "Paris",
    country: "France",
    local: "/images/inspiration/paris.jpg",
    remote:
      "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800",
    fallbackIndex: 0,
  },
  {
    city: "New York",
    country: "USA",
    local: "/images/inspiration/new-york.jpg",
    remote:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    fallbackIndex: 1,
  },
  {
    city: "Tokyo",
    country: "Japan",
    local: "/images/inspiration/tokyo.jpg",
    remote:
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800",
    fallbackIndex: 2,
  },
  {
    city: "Cape Town",
    country: "South Africa",
    local: "/images/inspiration/cape-town.jpg",
    remote:
      "https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=800",
    fallbackIndex: 3,
  },
  {
    city: "Phuket",
    country: "Thailand",
    local: "/images/inspiration/phuket.jpg",
    remote:
      "https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=800",
    fallbackIndex: 4,
  },
];

function InspirationCardImage({ place }) {
  const [src, setSrc] = useState(place.local);
  const [stage, setStage] = useState("local");

  function handleError() {
    if (stage === "local") {
      setStage("remote");
      setSrc(place.remote);
      return;
    }
    if (stage === "remote") {
      setStage("svg");
      setSrc(localPlaceholder(place.fallbackIndex));
    }
  }

  return (
    <img
      src={src}
      alt={`${place.city}, ${place.country}`}
      loading="lazy"
      onError={handleError}
    />
  );
}

/**
 * Global destination cards — real photos (local JPG, then remote, then SVG fallback).
 */
export default function InspirationSection() {
  return (
    <section className="inspiration">
      <h2 className="inspiration__title">Inspiration for your next trip</h2>

      <div className="inspiration__row">
        {DESTINATIONS.map((place) => (
          <Link
            key={place.city}
            to={`/locations?location=${encodeURIComponent(place.city)}`}
            className="inspiration-card"
          >
            <div className="inspiration-card__image">
              <InspirationCardImage place={place} />
            </div>
            <div className="inspiration-card__label">
              <span className="inspiration-card__city">{place.city}</span>
              <span className="inspiration-card__country">{place.country}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
