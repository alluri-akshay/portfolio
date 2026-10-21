import Link from "next/link";
import { BackToTop } from "./back-to-top";
import type { Profile } from "../content/portfolio";
import { MotionToggle } from "./motion-preferences";

export function SiteFooter({ profile }: { profile: Profile }) {
  return <footer className="footer"><div className="shell">
    <div className="footerIdentity"><Link className="footerName" href="/">{profile.name}<span aria-hidden="true">↗</span></Link><span>Software developer · React & browser automation</span><small>© {profile.year} {profile.name}</small></div>
    <div className="footerActions"><MotionToggle /><BackToTop /></div>
  </div></footer>;
}
