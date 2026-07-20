import React from 'react'

interface SectionHeadingProps {
  label: string
  title?: string
  className?: string
}

// Teal uppercase eyebrow label + optional bold title
export function SectionHeading({ label, title, className }: SectionHeadingProps) {
  return (
    <div className={className}>
      <p className="text-accent text-sm font-medium tracking-wider uppercase">{label}</p>
      {title && (
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      )}
    </div>
  )
}
