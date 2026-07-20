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

export function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
        <Link href="/" className="text-base font-bold tracking-tight">
          Jamkris
        </Link>
        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1" aria-label="Main">
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
          <div className="bg-border mx-1.5 h-4 w-px" aria-hidden />
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
