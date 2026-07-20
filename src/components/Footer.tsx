import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

const PLATFORM_LABELS: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  email: 'Email',
  x: 'X',
  instagram: 'Instagram',
}

export async function Footer() {
  const t = await getTranslations('footer')
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const socials = settings.socials ?? []

  return (
    <footer className="border-border border-t">
      <div className="text-muted mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <p className="text-xs opacity-70">{t('builtWith')}</p>
        </div>
        {socials.length > 0 && (
          <nav className="flex items-center gap-4" aria-label="Social links">
            {socials.map((social) => (
              <a
                key={social.id ?? social.url}
                href={social.url}
                target={social.platform === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                {PLATFORM_LABELS[social.platform] ?? social.platform}
              </a>
            ))}
          </nav>
        )}
        <a
          href="#"
          className="hover:text-accent text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ↑ {t('backToTop')}
        </a>
      </div>
    </footer>
  )
}
