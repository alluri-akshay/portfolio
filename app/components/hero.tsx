import Link from "next/link";
import { ArrowUpRight, Download, MapPin } from "./icons";
import type { Profile } from "../content/portfolio";
import { HeroEntrance, HeroLine } from "./motion";
import { MagneticContent } from "./magnetic-content";
import { DeveloperRobot } from "@/app/components/developer-robot";
import styles from "./hero.module.css";

export function Hero({ profile }: { profile: Profile }) {
  return <section className={`${styles.hero} shell`} id="top" aria-labelledby="hero-title">
    <div className={styles.copy}>
      <HeroEntrance><p className={styles.greeting}>Hello, I&apos;m</p></HeroEntrance>
      <h1 className={styles.headline} id="hero-title" tabIndex={-1}>
        <HeroLine>Alluri Akshay<span className={styles.period}>.</span></HeroLine>
        <HeroLine step={1}><span className={styles.role}>Software developer.</span></HeroLine>
      </h1>
      <HeroEntrance step={2}>
        <p className={styles.availability}>Open to software development opportunities.</p>
        <p className={styles.intro}>{profile.introduction}</p>
        <div className={`actions ${styles.actions}`}>
          <Link className="button primary" href="/projects"><MagneticContent>View projects<ArrowUpRight size={18} aria-hidden="true" /></MagneticContent></Link>
          <a className="button" href={profile.resumeUrl} download><MagneticContent>Download resume<Download size={17} aria-hidden="true" /></MagneticContent></a>
        </div>
        <div className={styles.location}><MapPin size={14} aria-hidden="true" /><span>{profile.location}</span><span aria-hidden="true">·</span><span>CSE graduate, 2026</span></div>
      </HeroEntrance>
    </div>
    <HeroEntrance step={3} className={styles.visual}><DeveloperRobot /></HeroEntrance>
  </section>;
}
