import Link from "next/link";
import { ArrowLeft, ArrowRight } from "./components/icons";
import { SiteNavigation } from "./components/site-navigation";
import { SiteFooter } from "./components/site-footer";
import { profile } from "./content/portfolio";
import { PageArrival } from "./components/motion";

export default function NotFound() {
  return <><SiteNavigation profile={profile} /><main id="main-content" tabIndex={-1}><section className="notFound shell" id="top"><PageArrival identity="not-found"><p className="eyebrow">404 / A small detour</p><h1 tabIndex={-1}>Page not found.</h1><p>The page you&apos;re looking for isn&apos;t here. You can still explore my projects or head back home.</p><div className="actions"><Link className="button primary" href="/#work"><span>Explore my work</span><ArrowRight size={17} aria-hidden="true" /></Link><Link className="button" href="/"><ArrowLeft size={17} aria-hidden="true" /><span>Back home</span></Link></div></PageArrival></section></main><SiteFooter profile={profile} /></>;
}
