import "./ListingHostSummary.css";

const HIGHLIGHTS = [
  {
    key: "entire",
    title: "Entire apartment",
    text: "You'll have the apartment to yourself",
    when: (listing) => listing.type?.toLowerCase().includes("entire"),
  },
  {
    key: "cleaning",
    title: "Enhanced cleaning",
    text: "This Host committed to Airbnb's 5-step enhanced cleaning process.",
    when: (listing) => listing.enhancedCleaning,
  },
  {
    key: "checkin",
    title: "Self check-in",
    text: "Check yourself in with the keypad.",
    when: (listing) => listing.selfCheckIn,
  },
  {
    key: "cancel",
    title: "Free cancellation before Feb 14",
    text: "Get a full refund if you cancel before the deadline.",
    when: () => true,
  },
];

function HostIcon({ type }) {
  const icons = {
    entire: (
      <path
        fill="currentColor"
        d="M12 3L4 9v12h6v-7h4v7h6V9l-8-6zm0 2.2L18 10v9h-2v-7H8v7H6v-9l6-4.8z"
      />
    ),
    cleaning: (
      <path
        fill="currentColor"
        d="M12 2l1.2 3.6L17 7l-3.8 1.4L12 12l-1.2-3.6L7 7l3.8-1.4L12 2zm-6 9h12v2H6v-2zm1 4h10l-1 6H8l-1-6z"
      />
    ),
    checkin: (
      <path
        fill="currentColor"
        d="M7 4h10v2H7V4zm-2 4h14v12H5V8zm2 2v8h10v-8H7zm2 2h2v2H9v-2zm4 0h2v2h-2v-2z"
      />
    ),
    cancel: (
      <path
        fill="currentColor"
        d="M7 2a5 5 0 105 5 5 5 0 00-5-5zm0 2a3 3 0 110 3 3 3 0 010-3zm-5 9h10v2H2v-2z"
      />
    ),
  };

  return (
    <svg className="listing-host__icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[type]}
    </svg>
  );
}

export default function ListingHostSummary({ listing }) {
  const highlights = HIGHLIGHTS.filter((item) => item.when(listing));
  const hostInitial = listing.host?.charAt(0)?.toUpperCase() || "H";

  return (
    <section className="listing-host">
      <div className="listing-host__title-row">
        <h1 className="listing-host__title">
          {listing.type} hosted by {listing.host}
        </h1>
        <div className="listing-host__avatar" aria-hidden="true">
          {hostInitial}
        </div>
      </div>
      <p className="listing-host__stats">
        {listing.guests} guests · {listing.type} · {listing.bedrooms} bedroom
        {listing.bedrooms === 1 ? "" : "s"} · {listing.bathrooms} bath
        {listing.bathrooms === 1 ? "" : "s"}
      </p>

      <ul className="listing-host__highlights">
        {highlights.map((item) => (
          <li key={item.key} className="listing-host__highlight">
            <HostIcon type={item.key} />
            <div>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </div>
          </li>
        ))}
      </ul>

      <p className="listing-host__description">{listing.description}</p>
    </section>
  );
}
