import { useEffect, useState } from "react";
import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import InspirationSection from "../components/InspirationSection";
import { apiGet } from "../api/client";
import "./Home.css";

/**
 * Home page — hero + inspiration cards (more sections on Days 13+).
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
      </main>
    </div>
  );
}
