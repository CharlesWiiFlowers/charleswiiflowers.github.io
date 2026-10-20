import { useCallback, useEffect, useState } from "react";
import Card from "./components/card.tsx";
import ProfileCard, { type HeroData } from "./components/ProfileCard.tsx";
import SkillCard, { type SkillItem } from "./components/SkillCard.tsx";
import SocialCard, { type SocialItem } from "./components/SocialCard.tsx";
import ProjectCard, { type ProjectItem } from "./components/ProjectCard.tsx";
import ParticlesBg from "./components/ParticlesBg.tsx";
import NavBar from "./components/NavBar.tsx";
import Footer from "./components/Footer.tsx";
import TacoEasterEgg from "./components/TacoEasterEgg.tsx";
import { useTheme } from "./hooks/useTheme.ts";
import data from "./assets/data.json";
import "./App.css";

const PARTICLES_KEY = "cosmic-place-particles";

function initialParticlesEnabled(): boolean {
  try {
    const stored = localStorage.getItem(PARTICLES_KEY);
    if (stored === "on") {
      return true;
    }
    if (stored === "off") {
      return false;
    }
  } catch {
    /* storage unavailable — fall through to media query default */
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    // Respect reduced-motion by default; the user can still opt back in.
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return true;
}

function useParticles() {
  const [enabled, setEnabled] = useState<boolean>(initialParticlesEnabled);
  useEffect(() => {
    try {
      localStorage.setItem(PARTICLES_KEY, enabled ? "on" : "off");
    } catch {
      /* storage unavailable — preference applies for this session only */
    }
  }, [enabled]);
  const toggle = useCallback(() => setEnabled((prev) => !prev), []);
  return { enabled, toggle };
}

interface PortfolioData {
  name: string;
  "about-me": string;
  "avatar-url": string;
  hero: HeroData;
  "skill-list": SkillItem[];
  "social-media": SocialItem[];
  "project-list": ProjectItem[];
  "currently-exploring"?: string[];
}

const portfolio = data as PortfolioData;

function NowSection({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <Card id="now" kicker="Now" title="Currently exploring" content="">
      <ul className="now-list">
        {items.map((item) => (
          <li key={item} className="now-item">
            <span className="now-dot" aria-hidden="true">
              ✦
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function App() {
  const { preference, resolved, setPreference } = useTheme();
  const { enabled: particlesEnabled, toggle: toggleParticles } = useParticles();

  const particleColor = resolved === "light" ? "#6d5bd0" : "#cfc6ff";
  const linkColor = resolved === "light" ? "#a89bd8" : "#8f83d8";

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ParticlesBg particleColor={particleColor} linkColor={linkColor} enabled={particlesEnabled} />
      <NavBar
        theme={preference}
        onThemeChange={setPreference}
        particlesEnabled={particlesEnabled}
        onToggleParticles={toggleParticles}
      />
      <main id="main" className="page">
        <ProfileCard hero={portfolio.hero} avatarUrl={portfolio["avatar-url"]} />
        <ProjectCard title="Projects" data={portfolio["project-list"]} />
        <Card id="about" kicker="About" title="About me" content={portfolio["about-me"]} />
        <SkillCard title="Toolkit" data={portfolio["skill-list"]} />
        <NowSection items={portfolio["currently-exploring"] ?? []} />
        <SocialCard title="Elsewhere" data={portfolio["social-media"]} />
      </main>
      <Footer />
      <TacoEasterEgg />
    </div>
  );
}
