"use client"

import { motion, useReducedMotion } from "framer-motion"

interface AnimatedWavesProps {
  height?: number
  width?: number
  flip?: boolean
  position?: "top" | "bottom"
  speedMultiplier?: number
}

export default function AnimatedWaves({
  height = 40,
  flip = false,
  position = "bottom",
  speedMultiplier = 1,
}: AnimatedWavesProps) {
  const prefersReducedMotion = useReducedMotion()

  const layerOneDuration = prefersReducedMotion ? 0 : 18 / speedMultiplier
  const layerTwoDuration = prefersReducedMotion ? 0 : 14 / speedMultiplier
  const layerThreeDuration = prefersReducedMotion ? 0 : 10 / speedMultiplier

  const layerOneY = prefersReducedMotion ? 0 : 2
  const layerTwoY = prefersReducedMotion ? 0 : 3
  const layerThreeY = prefersReducedMotion ? 0 : 4

  const waveOnePath =
    "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
  const waveTwoPath =
    "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
  const waveThreePath =
    "M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"

  return (
    <div
      className={`absolute left-0 right-0 w-full overflow-hidden leading-none pointer-events-none ${
        position === "top" ? "top-0 rotate-180" : "bottom-0"
      }`}
      style={{ height: `${height}px` }}
    >
      <motion.svg
        className={`absolute ${flip ? "rotate-180" : ""} w-full h-full`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.g
          animate={prefersReducedMotion ? undefined : { x: [0, -1200], y: [0, layerOneY, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  x: { duration: layerOneDuration, ease: "linear", repeat: Infinity },
                  y: { duration: layerOneDuration * 0.45, ease: "easeInOut", repeat: Infinity },
                }
          }
        >
          <path d={waveOnePath} className="fill-primary/20" />
          <path d={waveOnePath} className="fill-primary/20" transform="translate(1200, 0)" />
        </motion.g>

        <motion.g
          animate={prefersReducedMotion ? undefined : { x: [0, 1200], y: [0, -layerTwoY, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  x: { duration: layerTwoDuration, ease: "linear", repeat: Infinity },
                  y: { duration: layerTwoDuration * 0.42, ease: "easeInOut", repeat: Infinity },
                }
          }
        >
          <path d={waveTwoPath} className="fill-primary/40" />
          <path d={waveTwoPath} className="fill-primary/40" transform="translate(-1200, 0)" />
        </motion.g>

        <motion.g
          animate={prefersReducedMotion ? undefined : { x: [0, -1200], y: [0, layerThreeY, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  x: { duration: layerThreeDuration, ease: "linear", repeat: Infinity },
                  y: { duration: layerThreeDuration * 0.5, ease: "easeInOut", repeat: Infinity },
                }
          }
        >
          <path d={waveThreePath} className="fill-primary/60" />
          <path d={waveThreePath} className="fill-primary/60" transform="translate(1200, 0)" />
        </motion.g>
      </motion.svg>
    </div>
  )
}
