import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download, MapPin } from "./icons";
import type { Profile, Project } from "../content/portfolio";
import { HeroEntrance, HeroLine } from "./motion";
import { HeroPanel, HeroScene } from "./motion-scene";
import { MagneticContent } from "./magnetic-content";
import { HeroShowcase } from "./hero-showcase";

export function Hero({ profile, projects }: { profile: Profile; projects: Project[] }) {
  const showcases = projects.filter((project) => project.images?.length).slice(0, 2);
  return (
    <section className="hero shell" id="top" aria-labelledby="hero-title">
      <div className="heroCopy">
        <HeroEntrance><p className="heroName">Hi, I&apos;m {profile.name}.</p><p className="kicker">{profile.role} · React & browser automation</p></HeroEntrance>
        <h1 id="hero-title" tabIndex={-1}><HeroLine>Built with care.</HeroLine><HeroLine step={1}><em>Made to feel simple.</em></HeroLine></h1>
        <HeroEntrance step={2}>
        <p className="intro">{profile.introduction}</p>
        <div className="actions">
          <Link className="button primary" href="#work"><MagneticContent>Explore my work<ArrowDown size={18} aria-hidden="true" /></MagneticContent></Link>
          <a className="button" href={profile.resumeUrl} download><MagneticContent>Download resume<Download size={17} aria-hidden="true" /></MagneticContent></a>
        </div>
        <div className="heroLocation"><MapPin size={15} aria-hidden="true" /><span>{profile.location}</span><span className="locationSeparator" aria-hidden="true">/</span><span>CSE graduate, 2026</span></div>
        </HeroEntrance>
      </div>
      <HeroEntrance step={3} className="showcasePerspective" settled>
        <HeroShowcase surfaces={showcases.map(project => ({ slug: project.slug, title: project.title, kind: project.kind, ...project.images![0] }))}>
        <HeroScene className="heroShowcase">
          {showcases.map((project, index) => {
            const image = project.images![0];
            return (
              <HeroPanel front={index !== 0} key={project.slug}>
                <Link href={`/projects/${project.slug}`} aria-label={`Explore ${project.title}`}>
                  <Image src={image.src} alt={image.alt} width={image.width} height={image.height} unoptimized priority={index === 0} sizes="(max-width: 760px) 90vw, 45vw" />
                  <figcaption><div><strong>{project.title}</strong><span>{project.kind}</span></div><ArrowUpRight size={20} aria-hidden="true" /></figcaption>
                </Link>
              </HeroPanel>
            );
          })}
          <div className="showcaseNote"><span aria-hidden="true" />Real projects. Thoughtful interfaces.</div>
        </HeroScene>
        </HeroShowcase>
      </HeroEntrance>
    </section>
  );
}
