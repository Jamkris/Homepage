'use client'

import React, { useState } from 'react'

interface ExpandableTextProps {
  text: string
  moreLabel: string
  lessLabel: string
  /** Show the toggle only when the text is longer than this many characters */
  collapseThreshold?: number
  className?: string
}

const DEFAULT_THRESHOLD = 150

// Renders text that collapses to a few lines with a show more/less toggle when long.
// Short text is rendered as-is with no toggle.
export function ExpandableText({
  text,
  moreLabel,
  lessLabel,
  collapseThreshold = DEFAULT_THRESHOLD,
  className = '',
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false)
  const collapsible = text.length > collapseThreshold

  if (!collapsible) {
    return <p className={`text-muted text-sm whitespace-pre-line ${className}`}>{text}</p>
  }

  return (
    <div className={className}>
      <p
        className={`text-muted text-sm whitespace-pre-line ${expanded ? '' : 'line-clamp-3'}`}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="text-accent mt-1.5 text-xs font-medium hover:underline"
      >
        {expanded ? lessLabel : moreLabel}
      </button>
    </div>
  )
}
