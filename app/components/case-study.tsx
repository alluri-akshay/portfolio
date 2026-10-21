import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, CodeXml } from "./icons";
import type { Project } from "../content/portfolio";
import { PageArrival, Reveal } from "./motion";
import styles from "@/app/components/case-study.module.css";

export function CaseStudy({ project, nextProject }: { project: Project; nextProject: Project }) {
  return <article className={`${styles.page} shell`} id="top">
    <Link className={styles.back} href="/projects"><ArrowLeft size={15} aria-hidden="true" />All projects</Link>
    <PageArrival identity={project.slug}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{project.number} / {project.kind}</p>
          <h1 tabIndex={-1}>{project.title}</h1>
          <p className={styles.lead}>{project.cardSummary ?? project.summary}</p>
        </div>
        <div className={styles.actions}>
          {project.demoUrl && <a className={styles.primaryAction} href={project.demoUrl} target="_blank" rel="noreferrer">Live demo<ArrowUpRight size={15} aria-hidden="true" /></a>}
          {project.repositoryUrl && <a className={project.demoUrl ? styles.secondaryAction : styles.primaryAction} href={project.repositoryUrl} target="_blank" rel="noreferrer"><CodeXml size={15} aria-hidden="true" />View code<span className="srOnly"> on GitHub</span></a>}
        </div>
      </header>
    </PageArrival>
    <div className={styles.overview}>
      <div className={styles.previews}>
        {project.images?.map(image => <PageArrival as="figure" identity={`${project.slug}-${image.src}`} className={styles.figure} key={image.src}>
          <div className={styles.imageFrame}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} unoptimized sizes="(max-width: 800px) 90vw, 680px" /></div>
          <figcaption>{image.caption ?? image.alt}</figcaption>
        </PageArrival>)}
      </div>
      <aside className={styles.facts} aria-label="Project at a glance">
        <h2>At a glance</h2>
        <dl>
          <div><dt>My role</dt><dd>{project.contribution}</dd></div>
          <div><dt>Built for</dt><dd>{project.audience}</dd></div>
          <div><dt>Built with</dt><dd><ul className={styles.stack}>{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul></dd></div>
        </dl>
      </aside>
    </div>
    <div className={styles.sections}>
      {project.caseStudy.map((section, index) => <section className={styles.section} aria-labelledby={`case-${section.id}`} key={section.id}>
        <Reveal variant="quiet" className={styles.sectionHeading}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h2 id={`case-${section.id}`}>{section.title}</h2></Reveal>
        <div className={styles.sectionContent}>
          {section.body && <p>{section.body}</p>}
          {section.bullets && <ul>{section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>}
          {section.decisions && <dl className={styles.decisions}>{section.decisions.map(decision => <div key={decision.choice}><dt>{decision.choice}</dt><dd>{decision.reason}</dd>{decision.tradeoff && <dd>{decision.tradeoff}</dd>}</div>)}</dl>}
        </div>
      </section>)}
    </div>
    <nav className={styles.next} aria-label="Project navigation">
      <Link className={styles.back} href="/projects"><ArrowLeft size={15} aria-hidden="true" />All projects</Link>
      <Link className={styles.nextProject} href={`/projects/${nextProject.slug}`}><span>Next project</span><strong>{nextProject.title}<ArrowRight size={20} aria-hidden="true" /></strong></Link>
    </nav>
  </article>;
}
