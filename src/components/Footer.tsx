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
  const ctaHref =
    socials.find((social) => social.platform === 'email')?.url ?? socials[0]?.url ?? null

  return (
    <footer className="border-border overflow-hidden border-t">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="font-display text-accent text-xs font-medium tracking-[0.3em] uppercase">
          {t('ctaSub')}
        </p>
        {ctaHref ? (
          <a
            href={ctaHref}
            target={ctaHref.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="font-display text-stroke mt-4 inline-block text-[clamp(2.75rem,10vw,7.5rem)] leading-none font-bold tracking-tighter uppercase"
          >
            {t('cta')} ↗
          </a>
        ) : (
          <p className="font-display text-stroke mt-4 inline-block text-[clamp(2.75rem,10vw,7.5rem)] leading-none font-bold tracking-tighter uppercase">
            {t('cta')}
          </p>
        )}
      </div>
      <div className="border-border border-t">
        <div className="text-muted mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row sm:px-6">
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
          <a href="#" className="hover:text-foreground font-display text-xs tracking-[0.2em] uppercase transition-colors">
            ↑ {t('backToTop')}
          </a>
        </div>
      </div>
    </footer>
  )
}
