import Card from "./card";
import "./ProjectCard.css";

interface ProjectLinks {
  repository?: string;
  demo?: string;
  docs?: string;
}

export interface ProjectItem {
  name: string;
  content: string;
  category?: string;
  status?: string;
  platform?: string;
  link?: string;
  links?: ProjectLinks;
  image?: string;
  technologies?: string[];
}

function techName(entry: string): string {
  // Stored as "Name/icon-class"; tolerate plain names too.
  const cut = entry.indexOf("/");
  if (cut === -1) {
    return entry;
  }
  return entry.substring(0, cut);
}

function primaryLink(project: ProjectItem): string | undefined {
  return project.links?.repository ?? project.links?.demo ?? project.links?.docs ?? project.link;
}

function linkList(project: ProjectItem): Array<{ label: string; href: string }> {
  const out: Array<{ label: string; href: string }> = [];
  if (project.links?.repository) {
    out.push({ label: "Repository", href: project.links.repository });
  }
  if (project.links?.demo) {
    out.push({ label: "Live demo", href: project.links.demo });
  }
  if (project.links?.docs) {
    out.push({ label: "Docs", href: project.links.docs });
  }
  if (out.length === 0 && project.link) {
    out.push({ label: project.platform ? `Open on ${project.platform.split("/")[0]}` : "Open project", href: project.link });
  }
  return out;
}

function ProjectCard({ title, subtitle, data }: { title: string; subtitle?: string; data: ProjectItem[] }) {
  if (data.length === 0) {
    return null;
  }
  return (
    <Card
      id="projects"
      kicker="Selected work"
      title={title}
      subtitle={subtitle ?? "Things I've built and shared."}
    >
      <ul className="project-grid">
        {data.map((project) => {
          const href = primaryLink(project);
          const links = linkList(project);
          return (
            <li key={project.name} className="project-card">
              {project.image && href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="project-media-link">
                  <img className="project-image" src={project.image} alt="" loading="lazy" />
                </a>
              ) : project.image ? (
                <img className="project-image" src={project.image} alt="" loading="lazy" />
              ) : null}
              <div className="project-body">
                <div className="project-meta">
                  {project.category && <span className="project-badge">{project.category}</span>}
                  {project.status && <span className="project-status">{project.status}</span>}
                </div>
                <h3 className="project-name">{project.name}</h3>
                <p className="project-desc">{project.content}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <ul className="project-tags" aria-label={`Technologies used in ${project.name}`}>
                    {project.technologies.map((tech) => (
                      <li key={tech} className="project-tag">
                        {techName(tech)}
                      </li>
                    ))}
                  </ul>
                )}
                {links.length > 0 && (
                  <div className="project-links">
                    {links.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${item.label} for ${project.name} (opens in a new tab)`}
                      >
                        {item.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export default ProjectCard;
