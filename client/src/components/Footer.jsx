import "./Footer.css";

const columns = [
  {
    title: "Support",
    links: [
      "Help Center",
      "Safety information",
      "Cancellation options",
      "Our COVID-19 Response",
      "Supporting people with disabilities",
      "Report a neighbourhood concern",
    ],
  },
  {
    title: "Community",
    links: [
      "Airbnb.org: disaster relief housing",
      "Support Afghan refugees",
      "Combating discrimination",
      "Gift cards",
    ],
  },
  {
    title: "Hosting",
    links: [
      "Try hosting",
      "AirCover: protection for Hosts",
      "Explore hosting resources",
      "Visit our community forum",
      "How to host responsibly",
    ],
  },
  {
    title: "About",
    links: [
      "Newsroom",
      "Learn about new features",
      "Letter from our founders",
      "Careers",
      "Investors",
    ],
  },
];

/**
 * Static footer — four columns aligned with future getaways grid (video guide).
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid home-four-col">
        {columns.map((col) => (
          <div key={col.title} className="site-footer__col">
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
