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
    <footer className="border-border/60 border-t">
      <div className="text-muted mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm sm:flex-row sm:px-6">
        <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        {socials.length > 0 && (
          <nav className="flex items-center gap-4" aria-label="Social links">
            {socials.map((social) => (
              <a
                key={social.id ?? social.url}
                href={social.url}
                target={social.platform === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {PLATFORM_LABELS[social.platform] ?? social.platform}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  )
}
