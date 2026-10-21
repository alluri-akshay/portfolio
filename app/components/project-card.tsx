import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CodeXml } from "./icons";
import type { Project } from "../content/portfolio";
import { Reveal } from "./motion";
import { WorkPreview } from "@/app/components/work-preview";
import styles from "./selected-work.module.css";

export function ProjectLinks({ project }: { project: Project }) {
  return <>
    {project.demoUrl && <a className="projectExternal" href={project.demoUrl} target="_blank" rel="noreferrer"><span>Live demo</span><ArrowUpRight size={16} aria-hidden="true" /></a>}
    {project.repositoryUrl && <a className="projectExternal" href={project.repositoryUrl} target="_blank" rel="noreferrer"><CodeXml size={16} aria-hidden="true" /><span>Source code</span><ArrowUpRight size={15} aria-hidden="true" /></a>}
  </>;
}

export function ProjectCard({ project, featured = false, delay = 0 }: { project: Project; featured?: boolean; delay?: number }) {
  const image = project.images?.[0];
  return <article id={`work-${project.slug}`} className={styles.card} data-project={project.slug}>
    <Reveal variant="visual" className={styles.cardInner} delay={delay}>
      <div className={styles.visual}>
        {image ? <Link className={`projectImage ${styles.imageLink}`} href={`/projects/${project.slug}`} aria-label={`View ${project.title} project details`}>
          <WorkPreview><Image src={image.src} alt={image.alt} width={image.width} height={image.height} unoptimized sizes="(max-width: 760px) 85vw, (max-width: 1400px) 48vw, 570px" /></WorkPreview>
        </Link> : <p className={styles.previewFallback}>{project.title}<span>Prefill · Validate · Submit</span></p>}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}><span className={styles.category}><span className={styles.number}>{project.number}</span>{project.kind}</span>{featured && <span className={styles.featuredLabel}>Featured</span>}</div>
        <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
        <p className={styles.summary}>{project.cardSummary ?? project.summary}</p>
        <dl className={styles.role}><dt>My role</dt><dd>{project.contribution}</dd></dl>
        <ul className={styles.technologies} aria-label={`${project.title} technologies`}>{project.technologies.slice(0, 3).map(technology => <li key={technology}>{technology}</li>)}</ul>
        <div className={styles.actions}>
          <Link className={styles.primaryLink} href={`/projects/${project.slug}`} aria-label={`View ${project.title} project`}>View project<ArrowRight size={15} aria-hidden="true" /></Link>
          {project.demoUrl && <a className={styles.externalLink} href={project.demoUrl} target="_blank" rel="noreferrer">Live demo<ArrowUpRight size={14} aria-hidden="true" /></a>}
          {project.repositoryUrl && <a className={styles.externalLink} href={project.repositoryUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}><CodeXml size={14} aria-hidden="true" />GitHub</a>}
        </div>
      </div>
    </Reveal>
  </article>;
}

export function SelectedWork({ projects, standalone = false }: { projects: Project[]; standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  const featured = projects.find(project => project.slug === "career-nexus");
  const ordered = featured ? [featured, ...projects.filter(project => project !== featured)] : projects;
  return <section className={`${styles.section} shell`} id="work" aria-labelledby="work-title">
    <header className={styles.heading}>
      <Reveal variant="heading"><Heading id="work-title" tabIndex={standalone ? -1 : undefined}>Projects</Heading></Reveal>
      <Reveal as="p" variant="quiet">What I built and how it works.</Reveal>
    </header>
    <div className={styles.grid}>{ordered.map((project, index) => <ProjectCard project={project} featured={index === 0} key={project.slug} />)}</div>
  </section>;
}
