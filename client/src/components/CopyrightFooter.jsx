import "./CopyrightFooter.css";

/**
 * Copyright bar — legal text, social links, language and currency selectors.
 * Why: Brief requires copyright footer with social, language, and currency controls.
 */
export default function CopyrightFooter() {
  return (
    <div className="copyright">
      <div className="copyright__inner">
        <p className="copyright__text">
          © 2026 Airbnb Capstone Clone · Centurion demo · Not affiliated with Airbnb, Inc.
        </p>
        <div className="copyright__actions">
          <div className="copyright__social">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="Twitter">
              𝕏
            </a>
            <a href="#" aria-label="Instagram">
              ◎
            </a>
          </div>
          <label className="copyright__select">
            <span className="visually-hidden">Language</span>
            <select defaultValue="en" aria-label="Language">
              <option value="en">English (ZA)</option>
              <option value="af">Afrikaans</option>
              <option value="zu">IsiZulu</option>
              <option value="tn">Setswana</option>
              <option value="st">SeSotho</option>
              <option value="nr">IsiNdebele</option>
            </select>
          </label>
          <label className="copyright__select">
            <span className="visually-hidden">Currency</span>
            <select defaultValue="zar" aria-label="Currency">
              <option value="zar">ZAR R</option>
              <option value="usd">USD $</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
