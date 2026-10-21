import { ArrowUpRight } from "./icons";
import { SocialBrandIcon } from "./social-brand-icon";
import type { Profile, SkillGroup } from "../content/portfolio";
import { Reveal } from "./motion";
import styles from "@/app/components/profile-sections.module.css";

export function AboutSection({ profile, skillGroups, standalone = false }: { profile: Profile; skillGroups: SkillGroup[]; standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  const company = "SuperCommands";
  const companyIndex = profile.about.indexOf(company);
  const profileGroups = [
    profile.socials.filter(social => ["GitHub", "LinkedIn"].includes(social.label)),
    profile.socials.filter(social => !["GitHub", "LinkedIn"].includes(social.label)),
  ];
  return <section className={`${styles.about} shell`} id="about" aria-labelledby="about-title">
    <Reveal variant="quiet" respectDevicePreference className={styles.heading}><Heading id="about-title" tabIndex={standalone ? -1 : undefined}>About & skills</Heading></Reveal>
    <div className={styles.aboutLayout}>
      <Reveal variant="quiet" respectDevicePreference className={styles.intro}>
        <p>{companyIndex < 0 ? profile.about : <>{profile.about.slice(0, companyIndex)}<a className={styles.companyLink} href="https://supercommands.com/" target="_blank" rel="noreferrer">{company}</a>{profile.about.slice(companyIndex + company.length)}</>}</p>
        <nav className={styles.profiles} aria-label="Professional and coding profiles">{profileGroups.map((group, index) => !!group.length && <div className={styles.profileGroup} key={index}>{group.map(social => <a className={index === 0 ? styles.primaryProfile : undefined} href={social.url} key={social.label} target="_blank" rel="noreferrer"><SocialBrandIcon name={social.label} className={styles.brandIcon} /><span>{social.label}</span><ArrowUpRight size={12} aria-hidden="true" /></a>)}</div>)}</nav>
      </Reveal>
      <Reveal variant="quiet" respectDevicePreference className={styles.skillsPanel}>
        {skillGroups.map(group => <article className={styles.skillRow} key={group.title}>
          <h3>{group.title}</h3>
          <div className={styles.skillContent}>
            <ul className={styles.skillList} aria-label={`${group.title} technologies`}>{group.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
          </div>
        </article>)}
      </Reveal>
    </div>
  </section>;
}
