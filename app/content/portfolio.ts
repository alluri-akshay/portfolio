export interface ExternalLink { label: string; url: string }

export interface Profile {
  name: string;
  brand: string;
  role: string;
  location: string;
  introduction: string;
  about: string;
  year: number;
  email: string;
  phone: { display: string; uri: string };
  resumeUrl: string;
  socials: ExternalLink[];
}

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  sourceUrl?: string;
}

export interface CaseStudySection {
  id: string;
  title: string;
  body?: string;
  bullets?: string[];
  decisions?: { choice: string; reason: string; tradeoff?: string }[];
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  kind: string;
  summary: string;
  cardSummary?: string;
  overview: string;
  technologies: string[];
  tone: "slate" | "cyan" | "orange";
  contribution: string;
  audience: string;
  features: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  images?: ProjectImage[];
  caseStudy: CaseStudySection[];
}

export interface Experience {
  organization: string;
  role: string;
  dates: string;
  logo?: string;
  website?: string;
  focus?: string;
  contributions: { title: string; description: string }[];
  technologies?: string[];
}

export interface Credential {
  kind: "education" | "certification";
  title: string;
  institution: string;
  detail?: string;
  fieldOfStudy?: string;
  period?: string;
  result?: string;
  verificationUrl?: string;
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

// Personal contributions come from the existing resume. Repository/demo links
// and screenshot sources were inspected on 3 October 2026. Unverified business
// metrics are intentionally omitted; see docs/content-evidence-checklist.md.
export const profile: Profile = {
  name: "Akshay Alluri",
  brand: "AA",
  role: "Software developer",
  location: "Rajahmundry, India",
  introduction: "I build responsive web applications and browser automation with React and JavaScript.",
  about: "I'm a software developer at SuperCommands, building web interfaces and browser extensions.",
  year: 2026,
  email: "alluriakshay878@gmail.com",
  phone: { display: "+91 73866 60463", uri: "tel:+917386660463" },
  resumeUrl: "/Akshay-Alluri-Resume.pdf",
  socials: [
    { label: "GitHub", url: "https://github.com/alluri-akshay" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/sri-akshay-satya-srinivas-alluri" },
    { label: "LeetCode", url: "https://leetcode.com/u/alluriakshay/" },
    { label: "HackerRank", url: "https://www.hackerrank.com/profile/alluriakshay878" },
  ],
};

export const projects: Project[] = [
  {
    slug: "career-nexus", number: "01", title: "Career Nexus",
    kind: "Placement management",
    cardSummary: "Role-based dashboards connecting students, placement officers, and recruiters.",
    summary: "Connecting students, placement officers, and recruiters through clear, role-based dashboards.",
    overview: "A placement-management platform with different interfaces for students, Training and Placement Officers, and recruiters. My focus was reusable React components and responsive frontend workflows.",
    technologies: ["React.js", "Tailwind CSS", "Role-based UI"], tone: "slate",
    contribution: "Frontend development · responsive dashboards",
    audience: "Students, placement officers, and recruiters",
    features: ["Role-based dashboards", "Reusable React components", "Responsive application workflows"],
    repositoryUrl: "https://github.com/CareerNexus-Platform/CareerNexus-Frontend",
    demoUrl: "https://carrernexus-c413a.web.app/",
    images: [{ src: "/projects/career-nexus.jpg", alt: "Career Nexus public homepage with student, placement officer, and recruiter navigation", width: 1425, height: 891, caption: "The public Career Nexus landing page, captured from the live demo.", sourceUrl: "https://carrernexus-c413a.web.app/" }],
    caseStudy: [
      {
        "id": "problem",
        "title": "The project",
        "body": "Career Nexus is a placement-management platform with separate views for students, placement officers, and recruiters. Each role has its own application workflow."
      },
      {
        "id": "contribution",
        "title": "My contribution",
        "bullets": [
          "Developed role-based frontend dashboard interfaces.",
          "Built reusable React components for shared interface patterns.",
          "Created responsive layouts with Tailwind CSS."
        ]
      },
      {
        "id": "engineering",
        "title": "Implementation",
        "decisions": [
          {
            "choice": "Role-based views",
            "reason": "Separate interfaces keep each audience focused on its own placement tasks."
          },
          {
            "choice": "Shared components",
            "reason": "Reusable React components keep repeated dashboard patterns consistent across roles."
          }
        ]
      }
    ],
  },
  {
    slug: "auto-auth", number: "02", title: "Auto Auth", kind: "Healthcare workflow automation",
    cardSummary: "Guided healthcare forms with prefill, validation, and clear feedback.",
    summary: "Making multi-step healthcare forms easier to follow with prefill, validation, and clear submission feedback.",
    overview: "A healthcare authorization frontend supporting form entry and case workflows. My contribution focused on React form components, automated prefill, validation, and reliable feedback across multi-step interactions.",
    technologies: ["React.js", "Form validation", "State management"], tone: "cyan",
    contribution: "Frontend development · multi-step forms",
    audience: "Healthcare providers and staff",
    features: ["Automated form prefill", "Real-time validation", "Loading and submission feedback"],
    repositoryUrl: "https://github.com/IntelliAgents-AutoAuth/frontend",
    images: [{ src: "/projects/auto-auth-landing-concept.png", alt: "Auto Auth landing-page concept with shield-and-check branding, centered healthcare authorization headline, and healthcare professionals reviewing a tablet; not an application screenshot", width: 1586, height: 992, caption: "Landing-page and branding concept created for this portfolio, based on the documented healthcare form workflow. This is not an application screenshot or verified official branding." }],
    caseStudy: [
      {
        "id": "problem",
        "title": "The project",
        "body": "Auto Auth is a healthcare authorization frontend. My work focused on the form experience: entering information, reviewing prefilled values, and receiving clear validation and submission feedback."
      },
      {
        "id": "contribution",
        "title": "My contribution",
        "bullets": [
          "Built React form components with automated prefill and real-time validation.",
          "Managed form state across multiple steps, including data binding and error handling.",
          "Added loading indicators and submission feedback."
        ]
      },
      {
        "id": "engineering",
        "title": "Implementation",
        "decisions": [
          {
            "choice": "Prefill with validation",
            "reason": "Prefilled values remain available for review, with validation guiding users through required information."
          },
          {
            "choice": "Connected form state",
            "reason": "State management connects form steps with consistent loading, error, and submission feedback."
          }
        ]
      }
    ],
  },
  {
    slug: "burger-hut", number: "03", title: "Burger Hut", kind: "Responsive food ordering",
    cardSummary: "A responsive food-ordering frontend with a persistent cart.",
    summary: "A responsive ordering frontend with a persistent cart, straightforward navigation, and a working public demo.",
    overview: "A React food-ordering website with a browsable menu, client-side cart management, and navigation between views. It is deployed on Vercel through GitHub-based continuous deployment.",
    technologies: ["React.js", "React Router", "localStorage", "Vercel"], tone: "orange",
    contribution: "Frontend development · cart and navigation",
    audience: "People browsing a menu and building an order",
    features: ["Responsive menu", "Persistent client-side cart", "React Router navigation"],
    repositoryUrl: "https://github.com/alluri-akshay/Burger-Hut",
    demoUrl: "https://burger-hut-evgk.vercel.app/",
    images: [{ src: "/projects/burger-hut.jpg", alt: "Burger Hut public homepage showing its food-ordering introduction and menu action", width: 1425, height: 802, caption: "The Burger Hut homepage, captured from the public Vercel demo.", sourceUrl: "https://burger-hut-evgk.vercel.app/" }],
    caseStudy: [
      {
        "id": "problem",
        "title": "The project",
        "body": "Burger Hut is a React food-ordering frontend for browsing a menu and building a cart. It demonstrates the browsing and cart experience; it does not provide server-side ordering or payments."
      },
      {
        "id": "contribution",
        "title": "My contribution",
        "bullets": [
          "Connected menu and cart views with React Router.",
          "Implemented persistent client-side cart state using localStorage.",
          "Deployed the site to Vercel through GitHub-based continuous deployment."
        ]
      },
      {
        "id": "engineering",
        "title": "Implementation",
        "decisions": [
          {
            "choice": "React Router",
            "reason": "Client-side routing connects the menu and cart views."
          },
          {
            "choice": "Browser storage",
            "reason": "localStorage keeps cart data across visits in the same browser. It is device-local and can be cleared."
          }
        ]
      }
    ],
  },
];

export const experiences: Experience[] = [{
  organization: "SuperCommands", role: "Software developer", dates: "May 2026 – present",
  logo: "/brands/supercommands.png", website: "https://supercommands.com/",
  focus: "Browser extensions & application development",
  technologies: ["React", "Chrome extension APIs", "Git & GitHub"],
  contributions: [
    { title: "Application interfaces", description: "Building reusable React interfaces and browser automation for a productivity platform." },
    { title: "Browser integrations", description: "Connecting storage, runtime messaging, tabs, and background service workers through Chrome APIs." },
    { title: "Team collaboration", description: "Contributing through product reviews, code reviews, and GitHub workflows." },
  ],
}];

export const skillGroups: SkillGroup[] = [
  { title: "Frontend", skills: ["React.js", "React Router", "Tailwind CSS"] },
  { title: "Languages", skills: ["Java", "JavaScript", "SQL"] },
  { title: "Browser & storage", skills: ["Chrome extension APIs", "Chrome Storage", "localStorage"] },
  { title: "Tools & workflow", skills: ["Git", "GitHub", "Vite", "Vercel"] },
];

export const credentials: Credential[] = [
  { kind: "education", title: "B.Tech", fieldOfStudy: "Computer science and engineering", institution: "Pragati Engineering College", period: "2022 – 2026", result: "7.88 CGPA" },
  { kind: "education", title: "Intermediate", institution: "Narayana Junior College", period: "2020 – 2022", result: "79%" },
  { kind: "education", title: "Secondary school", institution: "Vivekananda Public School", period: "2020", result: "94%" },
  { kind: "certification", title: "Java certification", institution: "Infosys" },
  { kind: "certification", title: "Salesforce certified AI associate", institution: "Salesforce" },
  { kind: "certification", title: "SQL (intermediate)", institution: "HackerRank" },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
