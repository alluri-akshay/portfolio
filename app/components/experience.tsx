import { ArrowUpRight } from "./icons";
import type { Experience } from "../content/portfolio";
import { Reveal } from "./motion";
import styles from "@/app/components/experience.module.css";

export function ExperienceSection({ experiences, standalone = false }: { experiences: Experience[]; standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  return <section className={styles.section} id="experience" aria-labelledby="experience-title">
    <div className="shell">
      <Reveal variant="quiet" className={styles.heading}>
        <Heading id="experience-title" tabIndex={standalone ? -1 : undefined}>Experience</Heading>
      </Reveal>
      <div className={styles.roles}>{experiences.map(experience => <article key={`${experience.organization}-${experience.role}`}>
        <Reveal variant="quiet" className={styles.card}>
          <div className={styles.company}>
            {experience.logo && <img className={styles.logo} src={experience.logo} alt="" width={80} height={80} />}
            {experience.website ? <a className={styles.companyName} href={experience.website} target="_blank" rel="noreferrer">{experience.organization}<ArrowUpRight size={14} aria-hidden="true" /></a> : <strong className={styles.companyName}>{experience.organization}</strong>}
            <p className={styles.dates}>{experience.dates}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.roleLabel}>My role</p>
            <h3>{experience.role}</h3>
            {experience.focus && <p className={styles.focus}>{experience.focus}</p>}
            <dl className={styles.contributions}>{experience.contributions.map(contribution => <div className={styles.contribution} key={contribution.title}><dt>{contribution.title}</dt><dd>{contribution.description}</dd></div>)}</dl>
            {!!experience.technologies?.length && <div className={styles.stack}><span>Worked with</span><ul className={styles.technologies} aria-label={`${experience.organization} technologies`}>{experience.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul></div>}
          </div>
        </Reveal>
      </article>)}</div>
    </div>
  </section>;
}
