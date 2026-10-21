import { ArrowUpRight } from "./icons";
import { SocialBrandIcon } from "./social-brand-icon";
import type { Profile, SkillGroup } from "../content/portfolio";
import { Reveal } from "./motion";
import styles from "@/app/components/profile-sections.module.css";

export function AboutSection({ profile, skillGroups, standalone = false }: { profile: Profile; skillGroups: SkillGroup[]; standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  return <section className={`${styles.about} shell`} id="about" aria-labelledby="about-title">
    <Reveal variant="quiet" className={styles.heading}><Heading id="about-title" tabIndex={standalone ? -1 : undefined}>About & skills</Heading></Reveal>
    <div className={styles.aboutLayout}>
      <Reveal variant="quiet" className={styles.intro}>
        <p>{profile.about}</p>
        <nav className={styles.profiles} aria-label="Professional and coding profiles">{profile.socials.map(social => <a className={["GitHub", "LinkedIn"].includes(social.label) ? styles.primaryProfile : undefined} href={social.url} key={social.label} target="_blank" rel="noreferrer"><SocialBrandIcon name={social.label} className={styles.brandIcon} /><span>{social.label}</span><ArrowUpRight size={12} aria-hidden="true" /></a>)}</nav>
      </Reveal>
      <Reveal variant="quiet" className={styles.skillsPanel}>
        {skillGroups.map(group => <div className={styles.skillRow} key={group.title}>
          <h3>{group.title}</h3>
          <div className={styles.skillContent}>
            <ul className={styles.skillList} aria-label={`${group.title} technologies`}>{group.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
            {!!group.capabilities?.length && <p className={styles.capabilities}>{group.capabilities.join(" · ")}</p>}
          </div>
        </div>)}
      </Reveal>
    </div>
  </section>;
}
