import { AboutSection } from "./components/about";
import { ContactSection } from "./components/contact";
import { CredentialsSection } from "./components/credentials";
import { ExperienceSection } from "./components/experience";
import { Hero } from "./components/hero";
import { SelectedWork } from "./components/project-card";
import { SiteFooter } from "./components/site-footer";
import { SiteNavigation } from "./components/site-navigation";
import { credentials, experiences, profile, projects, skillGroups } from "./content/portfolio";

export default function Home() {
  const person = { "@context": "https://schema.org", "@type": "Person", name: profile.name, jobTitle: profile.role, sameAs: profile.socials.map((social) => social.url) };
  return <>
    <SiteNavigation profile={profile} home />
    <main id="main-content" tabIndex={-1}>
      <Hero profile={profile} />
      <SelectedWork projects={projects} />
      <div className="sectionDivider shell" aria-hidden="true" />
      <ExperienceSection experiences={experiences} />
      <div className="sectionDivider shell" aria-hidden="true" />
      <AboutSection profile={profile} skillGroups={skillGroups} />
      <div className="sectionDivider shell" aria-hidden="true" />
      <CredentialsSection credentials={credentials} />
      <ContactSection profile={profile} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} />
    </main>
    <SiteFooter profile={profile} />
  </>;
}
