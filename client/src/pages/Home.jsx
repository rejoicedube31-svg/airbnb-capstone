import { useEffect, useState } from "react";
import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import { apiGet } from "../api/client";
import "./Home.css";

/**
 * Home page — hero first; more sections added on Days 12–13.
 */
export default function Home() {
  const [listingCount, setListingCount] = useState(null);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    // Proof that React can talk to your backend
    apiGet("/api/accommodations?location=Centurion")
      .then((data) => setListingCount(data.count))
      .catch((err) => setApiError(err.message));
  }, []);

  return (
    <div className="home">
      <Header />
      <main>
        <HeroBanner />

        <section className="home__status">
          {apiError && (
            <p className="home__error">
              API not reachable — is the backend running on port 5000? ({apiError})
            </p>
          )}
          {!apiError && listingCount !== null && (
            <p className="home__api-ok">
              Connected to API — {listingCount} Centurion listing
              {listingCount === 1 ? "" : "s"} available
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
