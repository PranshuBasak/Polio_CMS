'use client'

import { Button } from '@/components/ui/button'
import { SkillsShowcase } from '@/components/ui/skills-showcase'
import { useHydration } from '@/lib/hooks/use-hydration'
import { useTranslations } from '@/lib/i18n/translations-context'
import { useSkillsStore } from '@/lib/stores'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

export default function SkillsSection() {
  const skills = useSkillsStore((state) => state.skills)
  const categories = useSkillsStore((state) => state.categories)
  const isHydrated = useHydration()
  const { t } = useTranslations()

  const topSkills = useMemo(() => {
    return [...skills]
      .sort((a, b) => b.level - a.level)
      .slice(0, 5)
      .map((skill) => ({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        icon: skill.icon,
      }))
  }, [skills])

  if (!isHydrated) return null

  return (
    <section id="skills" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-card/60 p-6 shadow-lg shadow-primary/5 backdrop-blur-sm sm:p-8"
      >
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-heading mb-3">{t('skills.title')}</h2>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{t('skills.description')}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              {categories.length} categories | {skills.length} skills tracked
            </p>
          </div>
          <Button asChild className="self-start sm:self-auto">
            <Link href="/skills">
              Explore all skills
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <SkillsShowcase skills={topSkills} compact title="Top skills" />
      </motion.div>
    </section>
  )
}
