import { useState } from "react";
import "../styles/DisclaimerBar.css";
import { ChevronDown } from "lucide-react";

type DisclaimerBarProps = {
  title?: string;
};

export default function DisclaimerBar({
  title = "Important Notes & Disclaimers",
}: DisclaimerBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tax-harvesting-section">
      <div className="header-row">
        <h2>Tax Harvesting</h2>

        <div
          className="tooltip-wrapper"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button className="how-it-works">How it works?</button>

          {showTooltip && (
            <div className="tooltip-box">
              <div className="tooltip-arrow" />

              <p>
                Lorem ipsum dolor sit amet consectetur. Euismod id posuere nibh
                semper mattis scelerisque tellus. Vel mattis diam duis morbi
                tellus dui consectetur.
              </p>

              <a href="#" className="know-more-link">
                Know More
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="disclaimer-wrapper">
        <button className="disclaimer-bar" onClick={() => setIsOpen(!isOpen)}>
          <div className="left-content">
            <div className="info-icon">i</div>
            <span>{title}</span>
          </div>

          <ChevronDown className={`arrow-icon ${isOpen ? "open" : ""}`} />
        </button>

        {isOpen && (
          <div className="dropdown-content">
            <ul>
              <li>
                Tax-loss harvesting is currently not allowed under Indian tax
                regulations. Please consult your tax advisor before making any
                decisions.
              </li>
              <li>
                Tax harvesting does not apply to derivatives or futures. These
                are handled separately as business income under tax rules.
              </li>
              <li>
                Price and market value data is fetched from CoinGecko, not from
                individual exchanges.
              </li>
              <li>
                Some countries do not have a short-term / long-term bifurcation.
              </li>
              <li>Only realized losses are considered for harvesting.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
