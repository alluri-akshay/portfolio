import { ArrowUpRight, Download } from "./icons";
import type { Profile } from "../content/portfolio";
import { CopyEmail } from "./copy-email";
import { Reveal } from "./motion";
import { SocialBrandIcon } from "./social-brand-icon";
import styles from "./contact.module.css";

export function ContactSection({ profile, standalone = false }: { profile: Profile; standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  const linkedIn = profile.socials.find(social => social.label === "LinkedIn");
  return (
    <section className={`contact ${styles.section}`} id="contact" aria-labelledby="contact-title">
      <div className={`shell ${styles.inner}`}>
        <Reveal variant="contact" className={styles.layout}>
          <div className={styles.copy}>
            <Heading id="contact-title" tabIndex={standalone ? -1 : undefined}>Contact</Heading>
            <p className={styles.description}>Reach me by email or LinkedIn.</p>
          </div>
          <div className={styles.details}>
            <div className={styles.emailRow}>
              <a className={styles.emailLink} href={`mailto:${profile.email}`}>{profile.email}</a>
              <CopyEmail email={profile.email} compact />
            </div>
            <div className={styles.links}>
              {linkedIn && <a href={linkedIn.url} target="_blank" rel="noreferrer"><SocialBrandIcon name="LinkedIn" /><span>LinkedIn</span><ArrowUpRight size={14} aria-hidden="true" /></a>}
              <a href={profile.resumeUrl} download><Download size={15} aria-hidden="true" /><span>Download resume</span></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
