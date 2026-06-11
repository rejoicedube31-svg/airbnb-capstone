import { useEffect, useState } from "react";
import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import InspirationSection from "../components/InspirationSection";
import DiscoverExperiences from "../components/DiscoverExperiences";
import ThingsToDo from "../components/ThingsToDo";
import ShopAirbnb from "../components/ShopAirbnb";
import FutureGetaways from "../components/FutureGetaways";
import Footer from "../components/Footer";
import CopyrightFooter from "../components/CopyrightFooter";
import { apiGet } from "../api/client";
import "./Home.css";

/**
 * Home page — complete per brief (hero through copyright footer).
 */
export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/api/accommodations?location=Centurion")
      .then((data) => setListings(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <Header />
      <main>
        <HeroBanner />
        <InspirationSection listings={listings} loading={loading} error={error} />
        <DiscoverExperiences />
        <ThingsToDo />
        <ShopAirbnb />
        <FutureGetaways />
      </main>
      <Footer />
      <CopyrightFooter />
    </div>
  );
}
