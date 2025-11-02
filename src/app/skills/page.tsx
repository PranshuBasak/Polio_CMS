import type { Metadata } from "next"
import { SkillsSectionContainer } from "./_components/interactive/skills-section-container"

export const metadata: Metadata = {
  title: "Skills & Expertise",
  description: "Explore my technical skills and areas of expertise",
}

export default function SkillsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SkillsSectionContainer />
    </div>
  )
}
