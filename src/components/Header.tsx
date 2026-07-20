'use client'

import { useTranslations } from 'next-intl'
import React from 'react'

import { Link, usePathname } from '@/i18n/navigation'

import { LocaleSwitcher } from './LocaleSwitcher'
import { ThemeToggle } from './ThemeToggle'

const NAV_ITEMS = [
  { href: '/blog', key: 'blog' },
  { href: '/about', key: 'about' },
  { href: '/portfolio', key: 'portfolio' },
] as const

interface NavLinksProps {
  className?: string
}

function NavLinks({ className }: NavLinksProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()

  return (
    <nav className={`flex items-center gap-5 sm:gap-7 ${className ?? ''}`} aria-label="Main">
      {NAV_ITEMS.map(({ href, key }, i) => {
        const isActive = pathname.startsWith(href)
        const label = t(key)
        return (
          <Link
            key={key}
            href={href}
            className={`group flex items-baseline gap-1.5 py-1.5 text-xs font-medium tracking-wider ${
              isActive ? 'text-accent' : 'text-muted'
            }`}
          >
            <span className="text-accent/70 text-[10px] tabular-nums">
              0{i + 1}
            </span>
            {/* rolling text hover */}
            <span className="relative inline-block overflow-hidden">
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                {label}
              </span>
              <span
                className="text-accent absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full"
                aria-hidden
              >
                {label}
              </span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

export function Header() {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight">Jamkris</span>
            <span className="text-muted hidden text-[10px] tracking-[0.25em] uppercase sm:inline">
              / Seunghyun Lee
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <NavLinks className="hidden sm:flex" />
            <div className="bg-border mx-2 hidden h-4 w-px sm:block" aria-hidden />
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <NavLinks className="pb-2 sm:hidden" />
      </div>
    </header>
  )
}
