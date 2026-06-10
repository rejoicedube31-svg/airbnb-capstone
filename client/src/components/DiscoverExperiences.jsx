import "./DiscoverExperiences.css";

const experiences = [
  {
    title: "Centurion food & market tours",
    description: "Taste local flavours and explore malls near the N1.",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    cta: "Explore experiences",
  },
  {
    title: "Gauteng outdoor adventures",
    description: "Hikes, parks, and day trips around Pretoria and Joburg.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    cta: "See activities",
  },
];

/**
 * Discover Airbnb Experiences — two promotional blocks.
 * Why: Brief requires experience sections with titles and buttons (static content).
 */
export default function DiscoverExperiences() {
  return (
    <section className="discover">
      <h2>Discover Airbnb Experiences</h2>
      <div className="discover__grid">
        {experiences.map((item) => (
          <article key={item.title} className="discover__card">
            <img src={item.image} alt="" />
            <div className="discover__overlay">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button type="button">{item.cta}</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
