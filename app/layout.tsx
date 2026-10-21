import type { Metadata } from "next";
import { pageMetadata } from "./lib/metadata";
import { MotionPreferences } from "./components/motion-preferences";
import { PageFocus } from "./components/page-focus";
import { CursorFeedback } from "./components/cursor-feedback";
import { ThemePreferences } from "./components/theme-preferences";
import { themeInitScript } from "./lib/theme";
import { motionInitScript } from "./lib/motion-preference";
import "@fontsource-variable/manrope";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("Alluri Akshay | Software developer", "Portfolio of Alluri Akshay, a software developer building responsive React interfaces and browser automation.");
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script id="portfolio-theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} /><script id="portfolio-motion-init" dangerouslySetInnerHTML={{ __html: motionInitScript }} /></head><body><ThemePreferences><MotionPreferences><PageFocus /><CursorFeedback /><a className="skipLink" href="#main-content">Skip to content</a>{children}</MotionPreferences></ThemePreferences></body></html>;
}
