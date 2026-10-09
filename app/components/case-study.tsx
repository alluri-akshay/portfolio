import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "./icons";
import type { Project } from "../content/portfolio";
import { PageArrival, Reveal } from "./motion";
import { ProjectLinks } from "./project-card";
import { ProjectWorkflow } from "./project-workflow";
import { CaseStudyContents } from "./case-study-contents";

export function CaseStudy({ project, nextProject }: { project: Project; nextProject: Project }) {
  return (
    <article className={`caseStudy shell ${project.tone}`} id="top">
      <Link className="textLink caseBack" href="/#work"><ArrowLeft size={17} aria-hidden="true" />All projects</Link>
      <header className="caseStudyHeader"><PageArrival identity={project.slug}><p className="eyebrow">Selected work / {project.number}</p><h1 tabIndex={-1}>{project.title}</h1><p className="caseStudyLead">{project.overview}</p></PageArrival>
        <PageArrival identity={`${project.slug}-details`} delay={0.06}>
        <div className="technologyTags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
        <dl className="caseStudyDetails"><div><dt>My role</dt><dd>{project.contribution}</dd></div><div><dt>Built for</dt><dd>{project.audience}</dd></div></dl>
        <div className="projectActions"><ProjectLinks project={project} /></div>
        </PageArrival>
      </header>
      {project.images?.map((image) => <PageArrival as="figure" identity={`${project.slug}-${image.src}`} delay={0.08} className="caseStudyImage" key={image.src}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} unoptimized sizes="(max-width: 900px) 100vw, 1180px" />
        <figcaption><span>{image.caption ?? image.alt}</span>{image.sourceUrl && <a href={image.sourceUrl} target="_blank" rel="noreferrer">View live<ArrowUpRight size={14} aria-hidden="true" /></a>}</figcaption>
      </PageArrival>)}
      {!project.images?.length && project.slug === "auto-auth" && <div className="caseWorkflow"><ProjectWorkflow /></div>}
      <div className="caseEvidence"><p className="eyebrow">Explore the work</p><p>{project.demoUrl ? "See the public frontend in action, or inspect its implementation in the repository." : "Inspect the frontend implementation in the public repository. The workflow above is an editorial illustration."}</p><div className="projectActions"><ProjectLinks project={project} /></div></div>
      <div className="caseStudyBody"><aside className="caseContents"><p className="eyebrow">In this project</p><CaseStudyContents key={project.slug} sections={project.caseStudy.map(({ id, title }) => ({ id, title }))} /></aside>
        <div className="caseStudySections">{project.caseStudy.map((section, index) => <div key={section.id}><section aria-labelledby={`case-${section.id}`}>
          <Reveal variant="reading"><p className="eyebrow">0{index + 1}</p><h2 id={`case-${section.id}`}>{section.title}</h2></Reveal>
          {section.body && <p>{section.body}</p>}
          {section.decisions && <div className="caseDecisions">{section.decisions.map((decision) => <article key={decision.choice}><Reveal variant="reading"><h3>{decision.choice}</h3></Reveal><p>{decision.reason}</p><p className="caseTradeoff"><strong>Tradeoff</strong>{decision.tradeoff}</p></article>)}</div>}
          {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
        </section></div>)}</div>
      </div>
      <nav className="caseStudyNext" aria-label="Project navigation"><Link className="textLink" href="/#work"><ArrowLeft size={17} aria-hidden="true" />All projects</Link><Link href={`/projects/${nextProject.slug}`} className="nextProject"><span>Up next</span><strong>{nextProject.title}<ArrowRight size={23} aria-hidden="true" /></strong><span className="srOnly">Next project: {nextProject.title}</span></Link></nav>
    </article>
  );
}
