import { ArrowUpRight, Mail } from "./icons";
import type { Profile } from "../content/portfolio";
import { CopyEmail } from "./copy-email";
import { Reveal } from "./motion";
import { DepthSurface } from "./depth-surface";

export function ContactSection({ profile }: { profile: Profile }) {
  const primary = profile.socials.filter((social) => ["GitHub", "LinkedIn"].includes(social.label));
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="shell contactInner">
        <Reveal variant="contact" className="contactInvitation">
        <DepthSurface className="messageDepth" restX={10} restY={-12}><span className="messageIcon" aria-hidden="true"><Mail size={44} strokeWidth={1.3} /></span></DepthSurface>
        <div>
        <p className="eyebrow">Let&apos;s connect</p>
        <h2 id="contact-title">Let&apos;s build something useful.</h2>
        <p className="contactIntro">Have a project, a question, or an idea to share? Let&apos;s start a conversation.</p>
        </div>
        </Reveal>
        <Reveal variant="contact" delay={0.06}>
        <div className="contactActions">
          <a className="email" href={`mailto:${profile.email}`}><Mail size={21} aria-hidden="true" />{profile.email}<ArrowUpRight size={20} aria-hidden="true" /></a>
          <CopyEmail email={profile.email} />
        </div>
        <nav className="contactLinks" aria-label="Professional profiles">
          {primary.map((social) => <a key={social.label} href={social.url} target="_blank" rel="noreferrer">{social.label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}
        </nav>
        </Reveal>
      </div>
    </section>
  );
}
