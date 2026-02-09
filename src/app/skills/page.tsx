import { BackgroundPaperShaders } from '@/components/ui/background-paper-shaders'
import type { Metadata } from 'next'

import { SkillsSectionContainer } from './_components/interactive/skills-section-container'

export const metadata: Metadata = {
  title: 'Skills & Expertise',
  description: 'Explore my technical skills and areas of expertise',
}

export default function SkillsPage() {
  return (
    <div className="relative isolate overflow-hidden">
      <BackgroundPaperShaders className="-z-10 opacity-60" speed={0.95} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background/35" />
      <div className="container relative z-10 mx-auto px-4 py-10 sm:py-12">
        <SkillsSectionContainer />
      </div>
    </div>
  )
}
