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
    <nav className={`flex items-center gap-1 ${className ?? ''}`} aria-label="Main">
      {NAV_ITEMS.map(({ href, key }) => {
        const isActive = pathname.startsWith(href)
        return (
          <Link
            key={key}
            href={href}
            className={`hover:bg-surface rounded-md px-2.5 py-1.5 text-sm transition-colors ${
              isActive ? 'text-foreground font-medium' : 'text-muted'
            }`}
          >
            {t(key)}
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
          <Link href="/" className="text-base font-bold tracking-tight">
            Jamkris
          </Link>
          <div className="flex items-center gap-1">
            <NavLinks className="hidden sm:flex" />
            <div className="bg-border mx-1.5 hidden h-4 w-px sm:block" aria-hidden />
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <NavLinks className="-mx-2.5 pb-2 sm:hidden" />
      </div>
    </header>
  )
}
