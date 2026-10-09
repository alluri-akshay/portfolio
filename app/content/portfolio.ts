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
  decisions?: { choice: string; reason: string; tradeoff: string }[];
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  kind: string;
  summary: string;
  overview: string;
  technologies: string[];
  tone: "violet" | "cyan" | "orange";
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
  contributions: string[];
}

export interface Credential {
  kind: "education" | "certification";
  title: string;
  institution: string;
  detail?: string;
  verificationUrl?: string;
}

export interface SkillGroup {
  title: string;
  skills: string[];
  projectSlug: string;
  projectLabel: string;
}

// Personal contributions come from the existing resume. Repository/demo links
// and screenshot sources were inspected on 3 October 2026. Unverified business
// metrics are intentionally omitted; see docs/content-evidence-checklist.md.
export const profile: Profile = {
  name: "Akshay Alluri",
  brand: "AA",
  role: "Frontend developer",
  location: "Rajahmundry, India",
  introduction: "I'm a computer science graduate building responsive React interfaces and browser automation that make everyday workflows easier.",
  about: "I like taking a complicated workflow and making it easier to use. My work spans role-based dashboards, form experiences, and browser automation. I care about reusable components, clear feedback, and the small details that help a product feel dependable.",
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
    summary: "Connecting students, placement officers, and recruiters through clear, role-based dashboards.",
    overview: "A placement-management platform with different interfaces for students, Training and Placement Officers, and recruiters. My focus was reusable React components and responsive frontend workflows.",
    technologies: ["React.js", "Tailwind CSS", "Role-based UI"], tone: "violet",
    contribution: "Frontend development · Responsive dashboards",
    audience: "Students, placement officers, and recruiters",
    features: ["Role-based dashboards", "Reusable React components", "Responsive application workflows"],
    repositoryUrl: "https://github.com/CareerNexus-Platform/CareerNexus-Frontend",
    demoUrl: "https://carrernexus-c413a.web.app/",
    images: [{ src: "/projects/career-nexus.jpg", alt: "Career Nexus public homepage with student, placement officer, and recruiter navigation", width: 1425, height: 891, caption: "The public Career Nexus landing page, captured from the live demo.", sourceUrl: "https://carrernexus-c413a.web.app/" }],
    caseStudy: [
      { id: "problem", title: "The problem", body: "Placement workflows involve several different people. Students need to follow applications, while placement officers and recruiters have their own tasks. The interface needs to make each role's workflow easy to find and follow." },
      { id: "contribution", title: "My contribution", bullets: ["Developed frontend dashboard interfaces for students, placement officers, and recruiters.", "Built reusable React components for consistent interface patterns.", "Used Tailwind CSS to create responsive layouts across device sizes."] },
      { id: "decisions", title: "Decisions and tradeoffs", decisions: [
        { choice: "Separate views for each role", reason: "Students, placement officers, and recruiters have different tasks. Role-specific dashboards give each audience a relevant starting point.", tradeoff: "More views need consistent navigation and shared interface patterns." },
        { choice: "Reusable React components", reason: "Shared components make repeated dashboard patterns easier to maintain and present consistently.", tradeoff: "A shared component still needs room for the differences between each role's workflow." },
      ] },
      { id: "engineering", title: "Engineering focus", body: "The frontend brings role-based views together in one application. Shared React components support consistency between screens, while responsive layouts adapt the workflow to smaller displays.", bullets: ["Role-specific views keep the interface focused on the user's task.", "Reusable components support consistent interactions across dashboards.", "Responsive styling lets the same workflows adapt across devices."] },
      { id: "result", title: "What it enables", body: "The public demo introduces placement tracking, analytics, notifications, and task management, with separate entry points for each role. The frontend repository provides the implementation for further inspection." },
      { id: "reflection", title: "What I take forward", body: "The next design question is how each role recovers when an application has no results or an action fails. Clear empty states, keyboard navigation, and role-specific journey tests would strengthen the dashboard experience." },
      { id: "next", title: "Next improvements", body: "I would next improve keyboard accessibility across dashboard flows, clarify empty and error states, and add automated checks for the main role-specific journeys." },
    ],
  },
  {
    slug: "auto-auth", number: "02", title: "Auto Auth", kind: "Healthcare workflow automation",
    summary: "Making multi-step healthcare forms easier to follow with prefill, validation, and clear submission feedback.",
    overview: "A healthcare authorization frontend supporting form entry and case workflows. My contribution focused on React form components, automated prefill, validation, and reliable feedback across multi-step interactions.",
    technologies: ["React.js", "Form validation", "State management"], tone: "cyan",
    contribution: "Frontend development · Multi-step forms",
    audience: "Healthcare providers and staff",
    features: ["Automated form prefill", "Real-time validation", "Loading and submission feedback"],
    repositoryUrl: "https://github.com/IntelliAgents-AutoAuth/frontend",
    caseStudy: [
      { id: "problem", title: "The problem", body: "Healthcare authorization involves detailed information and multiple steps. Repetitive entry and unclear validation can make the process difficult to follow. The interface needs to guide people through the form and make the status of their actions clear." },
      { id: "contribution", title: "My contribution", bullets: ["Developed EHR form components with automated data prefill and real-time validation.", "Managed state across multi-step workflows with data binding and error handling.", "Added loading indicators, submission recommendations, and feedback."] },
      { id: "decisions", title: "Decisions and tradeoffs", decisions: [
        { choice: "Prefill with validation", reason: "Prefill reduces repetitive entry, while validation helps users review the information they are about to submit.", tradeoff: "Prefilled values still need review. Automation should support the user without implying that every field is correct." },
        { choice: "State across form steps", reason: "Connected state lets a multi-step form retain values and present loading, error, and submission feedback consistently.", tradeoff: "Transitions need explicit behavior for incomplete fields, failed submissions, and retrying an action." },
      ] },
      { id: "engineering", title: "Engineering focus", body: "Form state, validation, and submission feedback need to remain consistent as users move between steps. The wider frontend includes case management, status tracking, document management, and an API service layer. My work focused on form components and their state and feedback.", bullets: ["Prefill supports repetitive entry while validation provides immediate guidance.", "State management connects the individual steps of the form.", "Loading and error states explain what is happening after an action."] },
      { id: "result", title: "What it enables", body: "The frontend supports a guided form experience with automated prefill, validation, and submission feedback. The public repository documents the wider authorization dashboard and its React implementation." },
      { id: "reflection", title: "What I take forward", body: "For a guided form, the recovery path matters as much as the successful submission. The next iteration should make errors easy to locate with a keyboard, preserve entered values after a failed request, and test step transitions using synthetic data." },
      { id: "next", title: "Next improvements", body: "I would next add keyboard and screen-reader checks for form errors and automated tests for step transitions. A public demonstration using synthetic data would make the workflow easier to inspect." },
    ],
  },
  {
    slug: "burger-hut", number: "03", title: "Burger Hut", kind: "Responsive food ordering",
    summary: "A responsive ordering frontend with a persistent cart, straightforward navigation, and a working public demo.",
    overview: "A React food-ordering website with a browsable menu, client-side cart management, and navigation between views. It is deployed on Vercel through GitHub-based continuous deployment.",
    technologies: ["React.js", "React Router", "localStorage", "Vercel"], tone: "orange",
    contribution: "Frontend development · Cart and navigation",
    audience: "People browsing a menu and building an order",
    features: ["Responsive menu", "Persistent client-side cart", "React Router navigation"],
    repositoryUrl: "https://github.com/alluri-akshay/Burger-Hut",
    demoUrl: "https://burger-hut-evgk.vercel.app/",
    images: [{ src: "/projects/burger-hut.jpg", alt: "Burger Hut public homepage showing its food-ordering introduction and menu action", width: 1425, height: 802, caption: "The Burger Hut homepage, captured from the public Vercel demo.", sourceUrl: "https://burger-hut-evgk.vercel.app/" }],
    caseStudy: [
      { id: "problem", title: "The problem", body: "An ordering interface needs to make browsing and selecting items straightforward. Users should be able to move between views while keeping the items they have already added to their cart." },
      { id: "contribution", title: "My contribution", bullets: ["Developed a responsive React food-ordering interface.", "Implemented persistent client-side cart management using localStorage.", "Implemented navigation with React Router.", "Deployed the application to Vercel through GitHub-based continuous deployment."] },
      { id: "decisions", title: "Decisions and tradeoffs", decisions: [
        { choice: "React Router for connected views", reason: "Client-side routing connects menu browsing and the cart without losing the structure of the ordering journey.", tradeoff: "Navigation still needs predictable focus, clear labels, and recoverable routes." },
        { choice: "localStorage for cart persistence", reason: "Browser storage keeps cart state available across visits on the same device.", tradeoff: "It is device-local and can be cleared or contain invalid data. It is not a server-side order or payment record." },
      ] },
      { id: "engineering", title: "Engineering focus", body: "React Router handles navigation between views, while localStorage supports client-side cart persistence. This is a frontend ordering experience; browser persistence does not provide a server-side order or payment system.", bullets: ["Client-side routing connects browsing and cart views.", "Browser storage lets cart state persist across visits on the same device.", "GitHub-based deployment provides a repeatable route to the public demo."] },
      { id: "result", title: "What it enables", body: "The live demo lets visitors browse a menu and explore the cart experience. Its source is publicly available for inspecting the React components and navigation." },
      { id: "reflection", title: "What I take forward", body: "A useful next step is testing the cart across reloads, empty states, and invalid stored data. A production ordering service would also need server-side order handling; the current project demonstrates the frontend browsing and cart experience." },
      { id: "next", title: "Next improvements", body: "Future improvements would include automated cart persistence tests, stronger keyboard labels for controls, and more resilient validation of stored cart data. A production ordering service would also need server-side order handling." },
    ],
  },
];

export const experiences: Experience[] = [{
  organization: "TaskLabs", role: "Software Development Intern", dates: "May 2026 – Present",
  contributions: [
    "Developing browser automation and reusable React interfaces for a productivity platform.",
    "Connecting components with Chrome Storage, Runtime Messaging, Tabs, and background service workers.",
    "Collaborating through product reviews, code reviews, Git, and GitHub workflows.",
  ],
}];

export const skillGroups: SkillGroup[] = [
  { title: "Languages", skills: ["Java", "JavaScript", "SQL"], projectSlug: "burger-hut", projectLabel: "JavaScript in Burger Hut" },
  { title: "Frontend", skills: ["React.js", "React Router", "Tailwind CSS"], projectSlug: "career-nexus", projectLabel: "React in Career Nexus" },
  { title: "Browser & automation", skills: ["Chrome APIs", "Automation", "localStorage"], projectSlug: "burger-hut", projectLabel: "Browser storage in Burger Hut" },
  { title: "Tools & workflow", skills: ["Git", "GitHub", "Vite", "Vercel"], projectSlug: "burger-hut", projectLabel: "Deployment in Burger Hut" },
];

export const credentials: Credential[] = [
  { kind: "education", title: "B.Tech · Computer Science & Engineering", institution: "Pragati Engineering College", detail: "2022 – 2026 · 7.88 CGPA" },
  { kind: "education", title: "Intermediate", institution: "Narayana Junior College", detail: "2020 – 2022 · 79%" },
  { kind: "education", title: "Secondary School", institution: "Vivekananda Public School", detail: "2020 · 94%" },
  { kind: "certification", title: "Java Certification", institution: "Infosys" },
  { kind: "certification", title: "Salesforce Certified AI Associate", institution: "Salesforce" },
  { kind: "certification", title: "SQL (Intermediate)", institution: "HackerRank" },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
