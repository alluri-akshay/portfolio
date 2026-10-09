import Link from "next/link";
import { ArrowUpRight } from "./icons";
import type { Profile, SkillGroup } from "../content/portfolio";
import { Reveal } from "./motion";
import { DepthSurface } from "./depth-surface";

export function AboutSection({ profile, skillGroups }: { profile: Profile; skillGroups: SkillGroup[] }) {
  const codingProfiles = profile.socials.filter((social) => ["LeetCode", "HackerRank"].includes(social.label));
  return (
    <section className="section shell about" id="about" aria-labelledby="about-title">
      <div><Reveal variant="quiet"><p className="eyebrow">03 / About & skills</p><h2 id="about-title">Curious about code.<br /><em>Thoughtful about people.</em></h2></Reveal><Reveal as="p" variant="quiet" delay={0.06} className="aboutText">{profile.about}</Reveal><a className="textLink" href={`mailto:${profile.email}`}>Say hello<ArrowUpRight size={17} aria-hidden="true" /></a>
        <div className="codingProfiles"><span>Coding profiles</span><nav aria-label="Coding profiles">{codingProfiles.map((social) => <a key={social.label} href={social.url} target="_blank" rel="noreferrer">{social.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</nav></div>
      </div>
      <div className="skills">{skillGroups.map((group, index) => <Reveal as="article" variant="quiet" delay={index * 0.06} key={group.title}><DepthSurface className="skillDepth" trigger="article"><span className="skillNumber">0{index + 1}</span><h3>{group.title}</h3><p>{group.skills.join(" · ")}</p></DepthSurface><Link href={`/projects/${group.projectSlug}`}>{group.projectLabel}<ArrowUpRight size={15} aria-hidden="true" /></Link></Reveal>)}</div>
    </section>
  );
}
