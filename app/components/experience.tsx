import { Briefcase, Check } from "./icons";
import type { Experience } from "../content/portfolio";
import { Reveal } from "./motion";
import { DepthSurface } from "./depth-surface";

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
      <div className="shell experienceGrid">
        <div><Reveal variant="experience"><p className="eyebrow light">02 / Experience</p><h2 id="experience-title">Learning by <br />building for <br /><em>real people.</em></h2></Reveal><Reveal as="p" variant="experience" className="muted">Practical engineering, product collaboration, and the details that make a workflow dependable.</Reveal></div>
        <div className="roles">{experiences.map((experience) => <article className="role" key={experience.organization}>
          <DepthSurface className="roleDepth" trigger="article" tone="feature">
          <Reveal variant="experience">
          <div className="roleCompany"><span className="roleIcon"><Briefcase size={21} aria-hidden="true" /></span><strong>{experience.organization}</strong><span className="roleDates">{experience.dates}</span></div>
          <h3>{experience.role}</h3>
          </Reveal>
          <Reveal variant="experience" delay={0.08}>
          <ul>{experience.contributions.map((contribution) => <li key={contribution}><Check size={17} aria-hidden="true" /><span>{contribution}</span></li>)}</ul>
          <div className="experienceTech"><span>React</span><span>Chrome Extension APIs</span><span>Git & GitHub</span></div>
          </Reveal>
          </DepthSurface>
        </article>)}</div>
      </div>
    </section>
  );
}
