'use client'

import { MenuVertical } from '@/components/ui/menu-vertical'
import { SkillsShowcase } from '@/components/ui/skills-showcase'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useSkillsData } from '../../_hooks/use-skills-data'

export function SkillsSectionContainer() {
  const { categories, skills } = useSkillsData()

  const groupedCategories = useMemo(() => {
    return categories
      .map((category) => {
        const scopedSkills = skills
          .filter((skill) => skill.category === category.id)
          .sort((a, b) => a.orderIndex - b.orderIndex)

        return {
          category,
          skills: scopedSkills,
          menuIcon: scopedSkills[0]?.icon,
        }
      })
      .filter((entry) => entry.skills.length > 0)
  }, [categories, skills])

  const menuItems = useMemo(
    () =>
      groupedCategories.map((entry) => ({
        id: entry.category.id,
        label: entry.category.name,
        iconSrc: entry.menuIcon,
      })),
    [groupedCategories],
  )

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => groupedCategories[0]?.category.id ?? '')
  const activeCategoryId = groupedCategories.some((entry) => entry.category.id === selectedCategoryId)
    ? selectedCategoryId
    : groupedCategories[0]?.category.id ?? ''

  const activeCategory = useMemo(
    () => groupedCategories.find((entry) => entry.category.id === activeCategoryId) ?? groupedCategories[0] ?? null,
    [groupedCategories, activeCategoryId],
  )

  if (skills.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/50 p-10 text-center text-muted-foreground">
        No skills added yet.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Skills & Expertise</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Explore categories, depth, and practical proficiency across the stack.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <aside>
          <div className="sticky top-24 rounded-2xl border border-border/30 bg-card/25 p-4 md:p-5">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Category Switcher</p>
            <MenuVertical menuItems={menuItems} activeId={activeCategoryId} onSelect={setSelectedCategoryId} color="var(--accent)" />
          </div>
        </aside>

        <div className="relative min-h-[520px]">
          <AnimatePresence mode="wait" initial={false}>
            {activeCategory ? (
              <motion.section
                key={activeCategory.category.id}
                initial={{ opacity: 0, x: 32, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -28, filter: 'blur(6px)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className={cn('rounded-2xl border border-border/35 bg-card/30 p-5 sm:p-7')}
              >
                <div className="mb-5 flex items-start justify-between gap-4 border-b border-border/40 pb-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      {activeCategory.category.name}
                    </h2>
                    {activeCategory.category.description ? (
                      <p className="text-sm text-muted-foreground sm:text-base">{activeCategory.category.description}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Focused capability cluster with production experience.</p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    {activeCategory.skills.length} {activeCategory.skills.length === 1 ? 'Skill' : 'Skills'}
                  </span>
                </div>

                <SkillsShowcase
                  title={activeCategory.category.name}
                  skills={activeCategory.skills.map((skill) => ({
                    id: skill.id,
                    name: skill.name,
                    level: skill.level,
                    icon: skill.icon,
                  }))}
                />
              </motion.section>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
