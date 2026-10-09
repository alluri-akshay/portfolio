import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CodeXml } from "./icons";
import type { Project } from "../content/portfolio";
import { Reveal } from "./motion";
import { ProjectPreview } from "./motion-scene";
import { ProjectChapter } from "./project-chapter";
import { ProjectWorkflow } from "./project-workflow";

export function ProjectLinks({ project }: { project: Project }) {
  return <>
    {project.demoUrl && <a className="projectExternal" href={project.demoUrl} target="_blank" rel="noreferrer"><span>Live demo</span><ArrowUpRight size={16} aria-hidden="true" /></a>}
    {project.repositoryUrl && <a className="projectExternal" href={project.repositoryUrl} target="_blank" rel="noreferrer"><CodeXml size={16} aria-hidden="true" /><span>Source code</span><ArrowUpRight size={15} aria-hidden="true" /></a>}
  </>;
}

export function ProjectCard({ project, featured = false, delay = 0 }: { project: Project; featured?: boolean; delay?: number }) {
  const image = project.images?.[0];
  return <ProjectChapter id={`work-${project.slug}`} className={`project projectChapter ${project.tone} ${featured ? "featuredProject" : ""}`}>
    <span className="chapterNumber" aria-hidden="true">{project.number}</span>
    <Reveal variant="visual" coordinated className="chapterVisual" delay={delay}>
      {image ? <Link className="projectImage" href={`/projects/${project.slug}`} aria-label={`View ${project.title} project details`}>
        <ProjectPreview title={project.title} warm={project.tone === "orange"}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} unoptimized sizes="(max-width: 900px) 100vw, 55vw" /></ProjectPreview>
      </Link> : <div className="projectConcept"><ProjectWorkflow /><Link className="conceptLink textLink" href={`/projects/${project.slug}`} aria-label={`Explore ${project.title} workflow`}>Explore the workflow<ArrowUpRight size={17} aria-hidden="true" /></Link></div>}
    </Reveal>
    <Reveal coordinated className="projectBody" delay={delay + 0.08}>
      <div className="meta"><span>{project.number} / {project.kind}</span>{featured && <span className="featuredLabel">Featured</span>}</div>
      <h3>{project.title}</h3><p>{project.summary}</p>
      <ul className="projectFeatures">{project.features.map((feature) => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>
      <div className="technologyTags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
      <div className="projectActions">
        <Link className="textLink chapterPrimary" href={`/projects/${project.slug}`} aria-label={`Read about ${project.title}`}>Read case study<ArrowRight size={18} aria-hidden="true" /></Link>
        {project.demoUrl && <a className="textLink secondaryLink" href={project.demoUrl} target="_blank" rel="noreferrer">Live demo<ArrowUpRight size={16} aria-hidden="true" /></a>}
      </div>
    </Reveal>
  </ProjectChapter>;
}

export function SelectedWork({ projects }: { projects: Project[] }) {
  return (
    <section className="section shell" id="work" aria-labelledby="work-title">
      <header className="sectionHead"><Reveal variant="heading"><p className="eyebrow">01 / Selected work</p><h2 id="work-title">A few things<br />I&apos;ve built.</h2></Reveal><Reveal as="p" variant="quiet" delay={0.08}>From placement workflows to browser automation, I build interfaces that help people get things done.</Reveal></header>
      <nav className="projectIndex" aria-label="Selected project chapters">{projects.map(project => <Link href={`#work-${project.slug}`} key={project.slug}><span>{project.number}</span>{project.title}<ArrowRight size={15} aria-hidden="true" /></Link>)}</nav>
      <div className="projects">{projects.map((project, index) => <ProjectCard project={project} featured={index === 0} delay={0} key={project.slug} />)}</div>
    </section>
  );
}
