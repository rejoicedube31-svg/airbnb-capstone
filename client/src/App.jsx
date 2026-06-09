import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";

/** Placeholder — Location page built on Day 14 */
function LocationPage() {
  return (
    <div className="placeholder-page">
      <h1>Location page</h1>
      <p>Coming on Day 14 — Centurion listings from the API.</p>
    </div>
  );
}

/** Placeholder — Listing details built on Day 18 */
function ListingDetailsPage() {
  return (
    <div className="placeholder-page">
      <h1>Listing details</h1>
      <p>Coming on Day 18 — cost calculator and reservation.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/locations" element={<LocationPage />} />
      <Route path="/listings/:id" element={<ListingDetailsPage />} />
    </Routes>
  );
}
