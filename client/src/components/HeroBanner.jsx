import { Link } from "react-router-dom";
import "./HeroBanner.css";

/**
 * Home hero — main call-to-action for Centurion stays.
 * Why: Brief requires a hero banner with clear call-to-action on Home page.
 */
export default function HeroBanner() {
  return (
    <section className="hero">
      <div className="hero__content">
        <p className="hero__eyebrow">Gauteng, South Africa</p>
        <h1>Find your next stay in Centurion</h1>
        <p className="hero__subtitle">
          Discover apartments and homes between Pretoria and Johannesburg — malls,
          highways, and quiet suburbs at your doorstep.
        </p>
        <Link to="/locations?location=Centurion" className="hero__cta">
          Explore Centurion stays
        </Link>
      </div>
    </section>
  );
}
