import "./profileCard.css";

export interface HeroAction {
  label: string;
  href: string;
  variant: string;
}

export interface HeroData {
  eyebrow: string;
  name: string;
  role: string;
  tagline: string;
  location: string;
  interests: string[];
  actions: HeroAction[];
}

function actionClass(variant: string): string {
  return variant === "primary" ? "btn btn-primary" : "btn btn-ghost";
}

function ProfileCard({ hero, avatarUrl }: { hero: HeroData | undefined; avatarUrl: string }) {
  if (!hero) {
    return null;
  }
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-text">
        <p className="hero-eyebrow">{hero.eyebrow}</p>
        <h1 id="hero-title" className="hero-title">
          {hero.name}
        </h1>
        <p className="hero-role">{hero.role}</p>
        <p className="hero-tagline">{hero.tagline}</p>
        <p className="hero-location">{hero.location}</p>
        <ul className="hero-interests" aria-label="Interests">
          {hero.interests.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
        <div className="hero-actions">
          {hero.actions.map((action) => (
            <a key={action.label} className={actionClass(action.variant)} href={action.href}>
              {action.label}
            </a>
          ))}
        </div>
      </div>
      <div className="hero-media">
        <img src={avatarUrl} alt={`Profile picture of ${hero.name}`} className="profile-picture" width={200} height={200} />
      </div>
    </section>
  );
}

export default ProfileCard;
