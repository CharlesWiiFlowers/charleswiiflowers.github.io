import "./profileCard.css";

interface HeroProps {
  name: string;
  role: string;
  tagline: string;
  avatarUrl: string;
  location: string;
  interests: string[];
}

function ProfileCard({ name, role, tagline, avatarUrl, location, interests }: HeroProps) {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-text">
        <p className="hero-eyebrow">Cosmic Place · personal portfolio</p>
        <h1 id="hero-title" className="hero-title">
          {name}
        </h1>
        <p className="hero-role">{role}</p>
        <p className="hero-tagline">{tagline}</p>
        <p className="hero-location">{location}</p>
        <ul className="hero-interests" aria-label="Interests">
          {interests.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projects">
            View projects
          </a>
          <a className="btn btn-ghost" href="#about">
            About me
          </a>
        </div>
      </div>
      <div className="hero-media">
        <img src={avatarUrl} alt="Profile picture of Carlos, known as Flowers" className="profile-picture" width={200} height={200} />
      </div>
    </section>
  );
}

export default ProfileCard;
