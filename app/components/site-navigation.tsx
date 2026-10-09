import Link from "next/link";
import { ArrowUpRight, Download } from "./icons";
import type { Profile } from "../content/portfolio";
import { MobileNavigation } from "./mobile-navigation";
import { ReadingProgress, SectionLinks } from "./section-navigation";
import { ThemeControl } from "./theme-preferences";

export function SiteNavigation({ profile, home = false }: { profile: Profile; home?: boolean }) {
  const anchor = (section: string) => `${home ? "" : "/"}#${section}`;
  return (
    <header className="siteHeader">
      <nav className="nav shell" aria-label="Main navigation">
        <Link className="brand" href={anchor("top")} aria-label={`${profile.name} home`}>{profile.brand}<span>.</span></Link>
        <div className="desktopNavigation">
          <div className="navLinks">
            <SectionLinks home={home} />
          </div>
          <a className="navResume" href={profile.resumeUrl} download>Resume<Download size={15} aria-hidden="true" /></a>
          <ThemeControl />
          <a className="navCta" href={`mailto:${profile.email}`}><span>Let&apos;s talk</span><ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <MobileNavigation home={home} resumeUrl={profile.resumeUrl} email={profile.email} />
      </nav>
      <ReadingProgress />
    </header>
  );
}
