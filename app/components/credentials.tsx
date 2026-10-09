import { ArrowUpRight, GraduationCap } from "./icons";
import type { Credential } from "../content/portfolio";
import { Reveal } from "./motion";

export function CredentialsSection({ credentials }: { credentials: Credential[] }) {
  const degree = credentials.find((credential) => credential.kind === "education");
  return (
    <section className="credentials shell" aria-labelledby="education-title">
      <Reveal variant="quiet"><p className="eyebrow">Education</p><h2 id="education-title">A foundation<br />in computer science.</h2>{degree && <article className="degree"><GraduationCap size={28} aria-hidden="true" /><div><h3>{degree.title}</h3><p>{degree.institution}</p><span>{degree.detail}</span></div></article>}</Reveal>
      <Reveal variant="quiet" className="certs" delay={0.06}><p className="eyebrow">Continued learning</p><h2>Certifications</h2>{credentials.filter((credential) => credential.kind === "certification").map((credential) => <article key={credential.title}><div>{credential.verificationUrl ? <a href={credential.verificationUrl} target="_blank" rel="noreferrer">{credential.title}<ArrowUpRight size={15} aria-hidden="true" /></a> : <h3>{credential.title}</h3>}<p>{credential.institution}</p></div></article>)}</Reveal>
    </section>
  );
}
