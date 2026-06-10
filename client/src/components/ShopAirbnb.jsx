import "./ShopAirbnb.css";

/**
 * ShopAirbnb — title + button on left, gift card image on right.
 * Why: Brief requires a two-column ShopAirbnb section on the Home page.
 */
export default function ShopAirbnb() {
  return (
    <section className="shop">
      <div className="shop__inner">
        <div className="shop__text">
          <h2>ShopAirbnb</h2>
          <p>
            Give the gift of travel — perfect for friends and family exploring
            Centurion and Gauteng.
          </p>
          <button type="button">Shop gift cards</button>
        </div>
        <div className="shop__image">
          <img
            src="https://images.unsplash.com/photo-1513885535751-616eb56668f1?auto=format&fit=crop&w=900&q=80"
            alt="Gift cards"
          />
        </div>
      </div>
    </section>
  );
}
