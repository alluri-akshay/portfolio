import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "../../components/case-study";
import { ContactSection } from "../../components/contact";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavigation } from "../../components/site-navigation";
import { getProjectBySlug, profile, projects } from "../../content/portfolio";
import { pageMetadata } from "../../lib/metadata";

interface ProjectPageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();
  return pageMetadata(`${project.title} | ${profile.name}`, project.overview, "article", `/projects/${project.slug}`);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];
  return <><SiteNavigation profile={profile} /><main id="main-content" tabIndex={-1}><CaseStudy project={project} nextProject={nextProject} /><ContactSection profile={profile} /></main><SiteFooter profile={profile} /></>;
}
