import { ArrowUpRight } from "./icons";
import type { Credential } from "../content/portfolio";
import { Reveal } from "./motion";
import styles from "@/app/components/profile-sections.module.css";

export function CredentialsSection({ credentials }: { credentials: Credential[] }) {
  const education = credentials.filter(credential => credential.kind === "education");
  const certifications = credentials.filter(credential => credential.kind === "certification");
  return <section className={`${styles.education} shell`} id="education" aria-labelledby="education-title">
    <div className={styles.educationLayout}>
      <Reveal variant="quiet">
        <div className={styles.heading}><h2 id="education-title">Education</h2></div>
        <ol className={styles.timeline}>
          {education.map((credential, index) => <li className={`${styles.educationRow} ${index === 0 ? styles.degree : ""}`} key={`${credential.title}-${credential.institution}`}>
            <p className={styles.educationPeriod}>{credential.period}</p>
            <article className={styles.educationDescription}>
              <h3>{credential.title}</h3>
              {credential.fieldOfStudy && <p className={styles.fieldOfStudy}>{credential.fieldOfStudy}</p>}
              <p>{credential.institution}</p>
              {credential.result && <p className={styles.educationResult}>{credential.result}</p>}
              {credential.detail && <p>{credential.detail}</p>}
            </article>
          </li>)}
        </ol>
      </Reveal>
      {!!certifications.length && <Reveal variant="quiet" className={styles.certifications}>
        <div className={styles.heading}><h2>Certifications</h2></div>
        <div className={styles.certificateList}>{certifications.map(credential => <article className={styles.certificate} key={`${credential.title}-${credential.institution}`}>
          <h3>{credential.title}</h3>
          <p>{credential.institution}</p>
          {credential.detail && <p>{credential.detail}</p>}
          {credential.verificationUrl && <a className={styles.credentialLink} href={credential.verificationUrl} target="_blank" rel="noreferrer" aria-label={`View ${credential.title} credential`}>View credential<ArrowUpRight size={13} aria-hidden="true" /></a>}
        </article>)}</div>
      </Reveal>}
    </div>
  </section>;
}
