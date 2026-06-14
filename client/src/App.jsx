import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LocationPage from "./pages/LocationPage";
import ListingDetailsPage from "./pages/ListingDetailsPage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/locations" element={<LocationPage />} />
      <Route path="/listings/:id" element={<ListingDetailsPage />} />
    </Routes>
  );
}
