import { useState } from "react";
import "./HostQuestionsBanner.css";

const LOCAL = "/images/hosting/superhost-banner.jpg";
const REMOTE =
  "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=1600";

function BannerImage() {
  const [src, setSrc] = useState(LOCAL);
  const [stage, setStage] = useState("local");

  function handleError() {
    if (stage === "local") {
      setStage("remote");
      setSrc(REMOTE);
    }
  }

  return (
    <img
      className="host-questions__photo"
      src={src}
      alt=""
      loading="lazy"
      onError={handleError}
    />
  );
}

/**
 * "Questions about hosting?" — full-bleed banner with Superhost CTA (video guide).
 */
export default function HostQuestionsBanner() {
  return (
    <section className="host-questions">
      <div className="host-questions__banner">
        <BannerImage />
        <div className="host-questions__overlay">
          <h2 className="host-questions__title">Questions about hosting?</h2>
          <button type="button" className="host-questions__cta">
            Ask a super host
          </button>
        </div>
      </div>
    </section>
  );
}
