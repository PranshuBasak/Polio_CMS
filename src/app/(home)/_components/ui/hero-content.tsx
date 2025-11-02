"use client"

import type React from "react"

import { Button } from "../../../../components/ui/button"
import { Github, Linkedin, FileText } from "lucide-react"
import { motion } from "framer-motion"
import type { HeroData } from "../../../../lib/types"

type HeroContentProps = {
  data: HeroData
  t: (key: string) => string
}

/**
 * Presentational component for hero content
 * Pure UI component with no business logic
 */
export function HeroContent({ data, t }: HeroContentProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">{data.name}</h1>
      <h2 className="text-2xl md:text-3xl text-muted-foreground mb-6 text-balance">{data.title}</h2>
      <p className="text-lg mb-8 max-w-md text-pretty leading-relaxed">{data.description}</p>

      <div className="flex flex-wrap gap-4">
        <Button asChild size="lg">
          <a href="#projects">{t("hero.viewProjects")}</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="/resume">{t("hero.downloadResume")}</a>
        </Button>
      </div>

      <div className="flex mt-8 gap-4">
        <SocialLink href="https://github.com/0xTanzim" icon={Github} label="GitHub" />
        <SocialLink href="https://linkedin.com/in/0xTanzim" icon={Linkedin} label="LinkedIn" />
        <SocialLink href="/resume" icon={FileText} label="Resume" />
      </div>
    </motion.div>
  )
}

type SocialLinkProps = {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

function SocialLink({ href, icon: Icon, label }: SocialLinkProps) {
  const isExternal = href.startsWith("http")

  return (
    <a
      href={href}
      {...(isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      className="text-muted-foreground hover:text-primary transition-colors"
      aria-label={label}
    >
      <Icon className="h-6 w-6" />
      <span className="sr-only">{label}</span>
    </a>
  )
}
