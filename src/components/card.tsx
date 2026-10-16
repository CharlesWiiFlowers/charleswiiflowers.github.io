import "./card.css";
import type { ReactNode } from "react";

interface CardProps {
  id?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  content?: string;
  children?: ReactNode;
}

function Card({ id, kicker, title, subtitle = "", content = "", children }: CardProps) {
  return (
    <section id={id} className="section-card" aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="section-head">
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 id={id ? `${id}-title` : undefined} className="section-title">
          {title}
        </h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
        {content && <p className="section-lede">{content}</p>}
      </div>
      {children && <div className="section-body">{children}</div>}
    </section>
  );
}

export default Card;
