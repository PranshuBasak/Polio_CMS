"use client"

import { motion } from "framer-motion"
import type { ComponentType } from "react"

/**
 * Higher-Order Component that adds scroll animation to sections
 * Implements the HOC pattern for reusable animation behavior
 */
export function withSectionAnimation<P extends object>(
  Component: ComponentType<P>,
  options?: {
    delay?: number
    duration?: number
  },
) {
  const { delay = 0, duration = 0.5 } = options || {}

  return function AnimatedSection(props: P) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration, delay }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}
