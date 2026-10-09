import Link from "next/link";
import { ArrowUp } from "./icons";
import type { Profile } from "../content/portfolio";
import { MotionToggle } from "./motion-preferences";

export function SiteFooter({ profile }: { profile: Profile }) {
  return <footer className="footer"><div className="shell">
    <span>© {profile.year} {profile.name}</span>
    <div className="footerActions"><MotionToggle /><Link href="#top">Back to top<ArrowUp size={16} aria-hidden="true" /></Link></div>
  </div></footer>;
}
