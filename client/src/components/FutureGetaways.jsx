import { useState } from "react";
import { Link } from "react-router-dom";
import "./FutureGetaways.css";

const tabs = [
  {
    id: "gauteng",
    label: "Gauteng",
    items: [
      { name: "Centurion", description: "Malls, highways, suburban stays" },
      { name: "Pretoria", description: "Jacaranda city and government precincts" },
      { name: "Johannesburg", description: "Urban culture, dining, and nightlife" },
      { name: "Midrand", description: "Between two cities, great for business" },
    ],
  },
  {
    id: "coastal",
    label: "Coastal",
    items: [
      { name: "Cape Town", description: "Table Mountain and the Atlantic" },
      { name: "Durban", description: "Warm beaches on the Indian Ocean" },
      { name: "Gqeberha", description: "Friendly city on the Sunshine Coast" },
      { name: "Hermanus", description: "Whale watching and wine nearby" },
    ],
  },
  {
    id: "winelands",
    label: "Winelands",
    items: [
      { name: "Stellenbosch", description: "Historic town and wine estates" },
      { name: "Franschhoek", description: "Food and wine valley" },
      { name: "Paarl", description: "Mountain views and cellars" },
      { name: "Robertson", description: "Quiet routes and tastings" },
    ],
  },
];

/**
 * Inspiration for future getaways — tabs + list content.
 * Why: Brief requires static tabs with list-format content on the Home page.
 */
export default function FutureGetaways() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const current = tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="getaways">
      <h2>Inspiration for future getaways</h2>
      <div className="getaways__tabs" role="tablist" aria-label="Future getaways">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? "getaways__tab active" : "getaways__tab"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ul className="getaways__list" role="tabpanel">
        {current.items.map((item) => (
          <li key={item.name}>
            <Link to="/locations">{item.name}</Link>
            <span>{item.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
