import "./Footer.css";

const columns = [
  {
    title: "Support",
    links: ["Help Centre", "AirCover", "Anti-discrimination", "Disability support"],
  },
  {
    title: "Hosting",
    links: ["Airbnb your home", "Airbnb Experiences", "Hosting resources", "Community forum"],
  },
  {
    title: "Airbnb",
    links: ["Newsroom", "Careers", "Investors", "Gift cards"],
  },
  {
    title: "Explore",
    links: ["Centurion stays", "Gauteng getaways", "South Africa", "Summer stays"],
  },
];

/**
 * Static footer — four columns of links.
 * Why: Brief requires a footer with links organised in 4 columns.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
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
