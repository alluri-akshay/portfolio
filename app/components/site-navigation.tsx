import Link from "next/link";
import { ArrowUpRight, Download } from "./icons";
import type { Profile } from "../content/portfolio";
import { MobileNavigation } from "./mobile-navigation";
import { SectionLinks } from "./section-navigation";
import { ThemeControl } from "./theme-preferences";
import styles from "./site-navigation.module.css";

export function SiteNavigation({ profile, home = false }: { profile: Profile; home?: boolean }) {
  return (
    <header className={`siteHeader ${styles.header}`}>
      <nav className="nav shell" aria-label="Main navigation">
        <Link className={styles.identity} href="/" aria-label="Alluri Akshay home">
          <span className={styles.monogram} aria-hidden="true">AA</span>
          <span className={styles.name}>Alluri Akshay</span>
        </Link>
        <div className="desktopNavigation">
          <div className="navLinks">
            <SectionLinks home={home} />
            <a className="navResume" href={profile.resumeUrl} download>Resume<Download size={14} aria-hidden="true" /></a>
          </div>
          <div className={styles.utilities}>
            <ThemeControl />
            <a className="navCta" href={`mailto:${profile.email}`}><span>Let&apos;s talk</span><ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <MobileNavigation home={home} resumeUrl={profile.resumeUrl} email={profile.email} />
      </nav>
    </header>
  );
}
