import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LocationPage from "./pages/LocationPage";
import "./App.css";

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
