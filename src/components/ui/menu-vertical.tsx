'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import React from 'react'

import CloudinaryImage from '@/components/ui/cloudinary-image'
import { cn } from '@/lib/utils'

type MenuVerticalItem = {
  id: string
  label: string
  iconSrc?: string
}

interface MenuVerticalProps {
  menuItems: MenuVerticalItem[]
  activeId: string
  onSelect: (id: string) => void
  color?: string
  skew?: number
  className?: string
}

export const MenuVertical = ({
  menuItems,
  activeId,
  onSelect,
  color = 'var(--accent)',
  skew = 0,
  className,
}: MenuVerticalProps) => {
  return (
    <nav className={cn('flex w-full flex-col gap-3', className)} aria-label="Skills categories">
      {menuItems.map((item) => {
        const isActive = item.id === activeId
        return (
          <motion.button
            key={item.id}
            type="button"
            className={cn(
              'group/nav relative flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
              isActive ? 'border-primary/60 bg-card/70 text-foreground' : 'border-border/50 bg-card/30 text-muted-foreground',
            )}
            initial="initial"
            animate={isActive ? 'hover' : 'initial'}
            whileHover="hover"
            onClick={() => onSelect(item.id)}
          >
            <motion.div
              variants={{
                initial: { x: '-100%', color: 'inherit', opacity: 0 },
                hover: { x: 0, color, opacity: 1 },
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="z-0"
            >
              <ArrowRight strokeWidth={3} className="size-5" />
            </motion.div>

            {item.iconSrc ? (
              <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-sm">
                <CloudinaryImage src={item.iconSrc} alt={`${item.label} icon`} fill className="object-contain" />
              </span>
            ) : null}

            <motion.span
              variants={{
                initial: { x: -8, color: 'inherit' },
                hover: { x: 0, color, skewX: skew },
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="text-base font-semibold sm:text-lg"
            >
              {item.label}
            </motion.span>

            <AnimatePresence>
              {isActive ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="ml-auto h-2 w-2 rounded-full bg-accent"
                />
              ) : null}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </nav>
  )
}

export type { MenuVerticalItem }
