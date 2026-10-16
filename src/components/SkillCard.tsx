import Card from "./card";
import "./SkillCard.css";

export interface SkillItem {
  category: string;
  source: string;
  name: string;
}

type SkillGroup = "language" | "framework" | "tool" | "hardware";

// Items saved under the legacy "technologies" bucket predate the four-group
// taxonomy. These well-known entries are frameworks & libraries; everything
// else from that bucket defaults to tools & platforms.
const LEGACY_FRAMEWORKS = new Set(["spring", "react", "tensorflow", "kivy", "vite"]);

function normalizeGroup(item: SkillItem): SkillGroup {
  const raw = item.category.trim().toLowerCase();
  if (raw === "language" || raw === "languages") {
    return "language";
  }
  if (raw === "framework" || raw === "frameworks" || raw === "library" || raw === "libraries") {
    return "framework";
  }
  if (raw === "hardware" || raw === "engineering") {
    return "hardware";
  }
  if (raw === "tool" || raw === "tools" || raw === "platform" || raw === "platforms" || raw === "technologies" || raw === "technology") {
    if (raw.startsWith("technolog") && LEGACY_FRAMEWORKS.has(item.name.trim().toLowerCase())) {
      return "framework";
    }
    return "tool";
  }
  return "tool";
}

const GROUPS: Array<{ key: SkillGroup; heading: string; blurb: string }> = [
  { key: "language", heading: "Languages", blurb: "Programming languages I work with." },
  { key: "framework", heading: "Frameworks & libraries", blurb: "What I use to build on top of languages." },
  { key: "tool", heading: "Tools & platforms", blurb: "Daily tooling, data stores and services." },
  { key: "hardware", heading: "Hardware & engineering", blurb: "Boards and engineering tech." },
];

function SkillCard({ title, subtitle, data }: { title: string; subtitle?: string; data: SkillItem[] }) {
  const grouped = new Map<SkillGroup, SkillItem[]>();
  for (const item of data) {
    const group = normalizeGroup(item);
    const list = grouped.get(group) ?? [];
    list.push(item);
    grouped.set(group, list);
  }

  return (
    <Card
      id="toolkit"
      kicker="Toolkit"
      title={title}
      subtitle={subtitle ?? "Grouped by what things are — no levels, no percentages."}
    >
      <div className="toolkit-groups">
        {GROUPS.map((group) => {
          const items = grouped.get(group.key) ?? [];
          if (items.length === 0) {
            return null;
          }
          return (
            <section key={group.key} className="toolkit-group" aria-label={group.heading}>
              <h3 className="toolkit-heading">{group.heading}</h3>
              <p className="toolkit-blurb">{group.blurb}</p>
              <ul className="toolkit-list">
                {items.map((item) => (
                  <li key={`${group.key}-${item.name}`} className="toolkit-item" title={item.name}>
                    <img src={item.source} alt="" aria-hidden="true" className="toolkit-icon" loading="lazy" />
                    <span className="toolkit-name">{item.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Card>
  );
}

export default SkillCard;
