import { useState } from "react";
import "./DiscoverExperiences.css";

const EXPERIENCES = [
  {
    id: "trip",
    title: "Things to do on your trip",
    button: "Experiences",
    local: "/images/experiences/trip.jpg",
    remote:
      "https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "online",
    title: "Things to do from home",
    button: "Online Experiences",
    local: "/images/experiences/online.jpg",
    remote:
      "https://images.pexels.com/photos/6605962/pexels-photo-6605962.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

function ExperienceCardImage({ experience }) {
  const [src, setSrc] = useState(experience.local);
  const [stage, setStage] = useState("local");

  function handleError() {
    if (stage === "local") {
      setStage("remote");
      setSrc(experience.remote);
    }
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={handleError}
    />
  );
}

/**
 * Discover Airbnb Experiences — two full-bleed cards (video guide layout).
 */
export default function DiscoverExperiences() {
  return (
    <section className="discover" id="experiences">
      <h2 className="discover__title">Discover Airbnb Experiences</h2>

      <div className="discover__grid">
        {EXPERIENCES.map((item) => (
          <article key={item.id} className="discover__card">
            <ExperienceCardImage experience={item} />
            <div className="discover__overlay">
              <h3 className="discover__heading">{item.title}</h3>
              <button type="button" className="discover__pill">
                {item.button}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
