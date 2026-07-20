import React from 'react'

interface MarqueeProps {
  items: string[]
  className?: string
}

// Infinite scrolling strip — items are duplicated once, track slides -50%
export function Marquee({ items, className }: MarqueeProps) {
  const strip = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span className="px-6">{item}</span>
          <span className="text-accent select-none" aria-hidden>
            ✦
          </span>
        </React.Fragment>
      ))}
    </div>
  )

  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${className ?? ''}`}>
      <div className="animate-marquee flex shrink-0">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  )
}
