import Card from "./card";
import "./SocialCard.css";

export interface SocialItem {
  name: string;
  link: string;
  title: string;
  source: string;
}

function SocialCard({ title, subtitle, data }: { title: string; subtitle?: string; data: SocialItem[] }) {
  return (
    <Card
      id="contact"
      kicker="Elsewhere"
      title={title}
      subtitle={subtitle ?? "Find me around the web."}
    >
      <ul className="social-list">
        {data.map((value) => (
          <li key={value.name} className="social-entry">
            <a
              href={value.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${value.name} (opens in a new tab)`}
              title={value.title}
              className="social-link"
            >
              <img src={value.source} alt="" aria-hidden="true" className="social-icon" loading="lazy" />
              <span className="social-text">
                <span className="social-name">{value.name}</span>
                <span className="social-hint">Open ↗</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default SocialCard;
