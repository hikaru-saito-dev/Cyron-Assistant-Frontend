'use client'
import React, { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TimelineAnimationProps {
  children: React.ReactNode
  animationNum: number
  timelineRef: React.RefObject<HTMLDivElement>
  className?: string
}

export function TimelineAnimation({
  children,
  animationNum,
  timelineRef,
  className,
}: TimelineAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(timelineRef, { once: true, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.55,
        delay: animationNum * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
