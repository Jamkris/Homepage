'use client'

import { motion } from 'motion/react'
import React from 'react'

interface AnimatedTitleProps {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'p'
}

// Word-by-word rise-up reveal for display headings
export function AnimatedTitle({ text, className, delay = 0, as: Tag = 'h1' }: AnimatedTitleProps) {
  const words = text.split(/\s+/).filter(Boolean)

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '115%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}
