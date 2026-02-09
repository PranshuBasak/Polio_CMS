'use client'

import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import React, { useState } from 'react'

import CloudinaryImage from '@/components/ui/cloudinary-image'
import { cn } from '@/lib/utils'

const CONSTANTS = {
  itemSize: 48,
  containerSize: 250,
  openStagger: 0.02,
  closeStagger: 0.07,
}

const STYLES = {
  trigger:
    'rounded-full flex items-center bg-foreground justify-center cursor-pointer outline-none ring-0 hover:brightness-125 transition-all duration-100 z-50',
  item: 'rounded-full flex items-center justify-center absolute bg-muted hover:bg-muted/50 cursor-pointer border border-border/60',
}

const pointOnCircle = (i: number, n: number, r: number, cx = 0, cy = 0) => {
  const theta = (2 * Math.PI * i) / n - Math.PI / 2
  return {
    x: cx + r * Math.cos(theta),
    y: cy + r * Math.sin(theta),
  }
}

type CircleMenuItem = {
  label: string
  href: string
  icon?: React.ReactNode
  iconSrc?: string
}

interface MenuItemProps {
  item: CircleMenuItem
  index: number
  totalItems: number
  isOpen: boolean
  onSelect: () => void
}

const MenuItem = ({ item, index, totalItems, isOpen, onSelect }: MenuItemProps) => {
  const { x, y } = pointOnCircle(index, totalItems, CONSTANTS.containerSize / 2)
  const [hovering, setHovering] = useState(false)

  return (
    <motion.a
      href={item.href}
      aria-label={item.label}
      animate={{
        x: isOpen ? x : 0,
        y: isOpen ? y : 0,
      }}
      whileHover={{
        scale: 1.08,
        transition: { duration: 0.1, delay: 0 },
      }}
      transition={{
        delay: isOpen ? index * CONSTANTS.openStagger : index * CONSTANTS.closeStagger,
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      style={{
        height: CONSTANTS.itemSize - 2,
        width: CONSTANTS.itemSize - 2,
      }}
      className={STYLES.item}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={onSelect}
    >
      {item.iconSrc ? (
        <span className="relative h-4 w-4 overflow-hidden rounded-sm">
          <CloudinaryImage src={item.iconSrc} alt={`${item.label} icon`} fill className="object-contain" />
        </span>
      ) : (
        item.icon
      )}
      {hovering ? (
        <p className="absolute top-full left-1/2 mt-1 -translate-x-1/2 whitespace-nowrap text-xs text-foreground">
          {item.label}
        </p>
      ) : null}
    </motion.a>
  )
}

interface MenuTriggerProps {
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
  itemsLength: number
  closeAnimationCallback: () => void
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
}

const MenuTrigger = ({
  setIsOpen,
  isOpen,
  itemsLength,
  closeAnimationCallback,
  openIcon,
  closeIcon,
}: MenuTriggerProps) => {
  const animate = useAnimationControls()
  const shakeAnimation = useAnimationControls()

  const closeAnimation = async () => {
    shakeAnimation.start({
      translateX: [0, 2, -2, 0, 2, -2, 0],
      transition: {
        duration: CONSTANTS.closeStagger,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      },
    })

    for (let i = 0; i < Math.max(itemsLength - 1, 1); i += 1) {
      const scale = 1 + i * 0.15
      await animate.start({
        height: Math.min(CONSTANTS.itemSize * scale, CONSTANTS.itemSize + CONSTANTS.itemSize / 2),
        width: Math.min(CONSTANTS.itemSize * scale, CONSTANTS.itemSize + CONSTANTS.itemSize / 2),
        transition: {
          duration: CONSTANTS.closeStagger / 2,
          ease: 'linear',
        },
      })
      if (i !== itemsLength - 2) {
        await new Promise((resolve) => setTimeout(resolve, CONSTANTS.closeStagger * 1000))
      }
    }

    shakeAnimation.stop()
    shakeAnimation.start({ translateX: 0, transition: { duration: 0 } })

    await animate.start({
      height: CONSTANTS.itemSize,
      width: CONSTANTS.itemSize,
      backgroundColor: 'var(--foreground)',
      transition: {
        duration: 0.1,
      },
    })
  }

  return (
    <motion.div animate={shakeAnimation} className="z-50">
      <motion.button
        type="button"
        aria-label={isOpen ? 'Close skills menu' : 'Open skills menu'}
        animate={animate}
        style={{
          height: CONSTANTS.itemSize,
          width: CONSTANTS.itemSize,
        }}
        className={cn(STYLES.trigger, isOpen && 'bg-foreground')}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false)
            closeAnimationCallback()
            void closeAnimation()
          } else {
            setIsOpen(true)
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {isOpen ? (
            <motion.span
              key="menu-close"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.2 }}
            >
              {closeIcon}
            </motion.span>
          ) : (
            <motion.span
              key="menu-open"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.2 }}
            >
              {openIcon}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}

type CircleMenuProps = {
  items: CircleMenuItem[]
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
  className?: string
}

const CircleMenu = ({
  items,
  className,
  openIcon = <Menu size={18} className="text-background" />,
  closeIcon = <X size={18} className="text-background" />,
}: CircleMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const animate = useAnimationControls()

  const closeAnimationCallback = async () => {
    await animate.start({
      rotate: -360,
      filter: 'blur(1px)',
      transition: {
        duration: CONSTANTS.closeStagger * (items.length + 2),
        ease: 'linear',
      },
    })
    await animate.start({
      rotate: 0,
      filter: 'blur(0px)',
      transition: { duration: 0 },
    })
  }

  return (
    <div
      style={{
        width: CONSTANTS.containerSize,
        height: CONSTANTS.containerSize,
      }}
      className={cn('relative place-self-center', className)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <MenuTrigger
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          itemsLength={items.length}
          closeAnimationCallback={closeAnimationCallback}
          openIcon={openIcon}
          closeIcon={closeIcon}
        />
      </div>
      <motion.div animate={animate} className="absolute inset-0 z-0 flex items-center justify-center">
        {items.map((item, index) => (
          <MenuItem
            key={`skills-menu-item-${item.label}-${index}`}
            item={item}
            index={index}
            totalItems={items.length}
            isOpen={isOpen}
            onSelect={() => setIsOpen(false)}
          />
        ))}
      </motion.div>
    </div>
  )
}

export { CircleMenu }
export type { CircleMenuItem }
