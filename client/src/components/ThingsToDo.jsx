import "./ThingsToDo.css";

const panels = [
  {
    id: "trip",
    title: "Things to do on your trip",
    subtitle: "Day trips from Centurion to Pretoria, Johannesburg, and beyond.",
    button: "Plan your trip",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "home",
    title: "Things to do at home",
    subtitle: "Relax in your Centurion stay — braai, pool, and fast Wi-Fi.",
    button: "Browse homes",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
];

/**
 * Things to do — trip + home blocks with background images and buttons.
 * Why: Brief requires two static sections with titles, buttons, and visuals.
 */
export default function ThingsToDo() {
  return (
    <section className="things">
      <div className="things__grid">
        {panels.map((panel) => (
          <article
            key={panel.id}
            className="things__panel"
            style={{ backgroundImage: `url(${panel.image})` }}
          >
            <div className="things__content">
              <h2>{panel.title}</h2>
              <p>{panel.subtitle}</p>
              <button type="button">{panel.button}</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
