import { ArrowUpRight, Mail } from "./icons";
import type { Profile } from "../content/portfolio";
import { CopyEmail } from "./copy-email";
import { Reveal } from "./motion";
import styles from "./contact.module.css";

export function ContactSection({ profile, standalone = false }: { profile: Profile; standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section className={`contact ${styles.section}`} id="contact" aria-labelledby="contact-title">
      <div className={`shell ${styles.inner}`}>
        <Reveal variant="contact" className={styles.copy}>
          <p className={styles.eyebrow}>Contact</p>
          <Heading id="contact-title" tabIndex={standalone ? -1 : undefined}>Get in touch.</Heading>
          <p className={styles.description}>For software development roles or project enquiries, reach me by email.</p>
        </Reveal>
        <Reveal variant="contact" delay={0.06} className={styles.emailPanel}>
          <p className={styles.emailLabel}><Mail size={16} aria-hidden="true" />Email</p>
          <a className={styles.emailLink} href={`mailto:${profile.email}`}><span>{profile.email}</span><ArrowUpRight size={18} aria-hidden="true" /></a>
          <div className={styles.actions}><CopyEmail email={profile.email} /></div>
        </Reveal>
      </div>
    </section>
  );
}
