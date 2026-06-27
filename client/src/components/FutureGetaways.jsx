import { useState } from "react";
import { Link } from "react-router-dom";
import "./FutureGetaways.css";

const tabs = [
  {
    id: "arts",
    label: "Destinations for arts and culture",
    items: [
      { name: "Eiffel Tower", place: "Paris, France" },
      { name: "Statue of Liberty", place: "New York, USA" },
      { name: "Shibuya Crossing", place: "Tokyo, Japan" },
      { name: "Big Ben", place: "London, UK" },
    ],
  },
  {
    id: "outdoor",
    label: "Destinations for outdoor adventure",
    items: [
      { name: "Table Mountain", place: "Cape Town, South Africa" },
      { name: "Drakensberg", place: "KwaZulu-Natal, South Africa" },
      { name: "Kruger National Park", place: "Mpumalanga, South Africa" },
      { name: "Garden Route", place: "Western Cape, South Africa" },
    ],
  },
  {
    id: "mountain",
    label: "Mountain cabins",
    items: [
      { name: "Aspen", place: "Colorado, USA" },
      { name: "Chamonix", place: "France" },
      { name: "Queenstown", place: "New Zealand" },
      { name: "Hogsback", place: "Eastern Cape, South Africa" },
    ],
  },
  {
    id: "beach",
    label: "Beach destinations",
    items: [
      { name: "Phuket", place: "Thailand" },
      { name: "Durban", place: "South Africa" },
      { name: "Malibu", place: "California, USA" },
      { name: "Bali", place: "Indonesia" },
    ],
  },
  {
    id: "popular",
    label: "Popular destinations",
    items: [
      { name: "Cape Town", place: "Western Cape, South Africa" },
      { name: "Pretoria", place: "Gauteng, South Africa" },
      { name: "Johannesburg", place: "Gauteng, South Africa" },
      { name: "Midrand", place: "Gauteng, South Africa" },
    ],
  },
  {
    id: "unique",
    label: "Unique stays",
    items: [
      { name: "Eiffel Tower", place: "Paris, France" },
      { name: "Statue of Liberty", place: "New York, USA" },
      { name: "Shibuya Crossing", place: "Tokyo, Japan" },
      { name: "Big Ben", place: "London, UK" },
    ],
  },
];

/**
 * Inspiration for future getaways — tabs + 4-column grid (video guide).
 */
export default function FutureGetaways() {
  const [activeTab, setActiveTab] = useState("unique");
  const current = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <section className="getaways">
      <h2 className="getaways__title">Inspiration for future getaways</h2>

      <div className="getaways__tabs" role="tablist" aria-label="Future getaways">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={
              activeTab === tab.id ? "getaways__tab getaways__tab--active" : "getaways__tab"
            }
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul className="getaways__grid home-four-col" role="tabpanel">
        {current.items.map((item) => (
          <li key={`${item.name}-${item.place}`} className="getaways__item">
            <Link to={`/locations?location=${encodeURIComponent(item.place.split(",")[0].trim())}`}>
              {item.name}
            </Link>
            <span>{item.place}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
