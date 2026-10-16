import "./NavBar.css";
import type { ThemePreference } from "../hooks/useTheme";

interface NavBarProps {
  theme: ThemePreference;
  onThemeChange: (next: ThemePreference) => void;
  particlesEnabled: boolean;
  onToggleParticles: () => void;
}

const THEME_LABELS: Record<ThemePreference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

function NavBar({ theme, onThemeChange, particlesEnabled, onToggleParticles }: NavBarProps) {
  return (
    <header className="navbar-wrap">
      <nav className="navbar" aria-label="Primary">
        <div className="navbar-left">
          <img src="./extra/unu.webp" className="navbar-mini-icon" alt="" />
          <a className="navbar-brand" href="#top">
            Cosmic Place
          </a>
          <ul className="navbar-links">
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#toolkit">Toolkit</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          <label className="theme-label" htmlFor="theme">
            Theme
          </label>
          <select
            name="theme"
            id="theme"
            className="select-theme"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as ThemePreference)}
            aria-label={`Appearance, currently ${THEME_LABELS[theme]}`}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <button
            type="button"
            className="particles-toggle"
            onClick={onToggleParticles}
            aria-pressed={particlesEnabled}
            title={particlesEnabled ? "Turn off the starfield background" : "Turn on the starfield background"}
          >
            {particlesEnabled ? "★ Stars on" : "☆ Stars off"}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
