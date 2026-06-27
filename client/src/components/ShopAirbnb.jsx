import { useState } from "react";
import "./ShopAirbnb.css";

const BASE =
  "https://content-s3.launchgiftcards.com/images/52405F4C-47AC-4795-93BB-E03F37C666D4";

const GIFT_CARDS = [
  {
    id: "villa",
    local: "/images/gift-cards/villa.png",
    remote: `${BASE}/2025_CiaraPool_Thumbnail_v01.png`,
    className: "shop__card shop__card--villa",
  },
  {
    id: "pink",
    local: "/images/gift-cards/pink.png",
    remote: `${BASE}/2025_Belo_Thumbnail_v01.png`,
    className: "shop__card shop__card--pink",
  },
  {
    id: "sunset",
    local: "/images/gift-cards/sunset.png",
    remote: `${BASE}/2025_IbrahimWooden_Thumbnail_v01.png`,
    className: "shop__card shop__card--sunset",
  },
];

function GiftCardImage({ card }) {
  const [src, setSrc] = useState(card.local);
  const [stage, setStage] = useState("local");

  function handleError() {
    if (stage === "local") {
      setStage("remote");
      setSrc(card.remote);
    }
  }

  return (
    <img
      className={card.className}
      src={src}
      alt=""
      loading="lazy"
      onError={handleError}
    />
  );
}

/**
 * Shop Airbnb gift cards — text + CTA left, stacked cards right (video guide).
 */
export default function ShopAirbnb() {
  return (
    <section className="shop">
      <div className="shop__inner">
        <div className="shop__text">
          <h2 className="shop__title">Shop Airbnb gift cards</h2>
          <button type="button" className="shop__cta">
            Learn more
          </button>
        </div>

        <div className="shop__cards" aria-hidden="true">
          {GIFT_CARDS.map((card) => (
            <GiftCardImage key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
