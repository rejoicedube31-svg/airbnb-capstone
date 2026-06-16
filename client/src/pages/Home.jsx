import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import HeroBanner from "../components/HeroBanner";
import InspirationSection from "../components/InspirationSection";
import DiscoverExperiences from "../components/DiscoverExperiences";
import ThingsToDo from "../components/ThingsToDo";
import ShopAirbnb from "../components/ShopAirbnb";
import FutureGetaways from "../components/FutureGetaways";
import { apiGet } from "../api/client";
import "./Home.css";

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
    <PageLayout>
      <main className="home">
        <HeroBanner />
        <InspirationSection listings={listings} loading={loading} error={error} />
        <DiscoverExperiences />
        <ThingsToDo />
        <ShopAirbnb />
        <FutureGetaways />
      </main>
    </PageLayout>
  );
}
