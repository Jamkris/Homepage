'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'

import { usePathname, useRouter } from '@/i18n/navigation'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const t = useTranslations('locale')

  const nextLocale = locale === 'ko' ? 'en' : 'ko'

  const handleSwitch = () => {
    // @ts-expect-error -- params are compatible with the typed pathname
    router.replace({ pathname, params }, { locale: nextLocale })
  }

  return (
    <button
      type="button"
      aria-label={t('switch')}
      onClick={handleSwitch}
      className="hover:bg-surface flex h-9 items-center rounded-md px-2.5 text-sm font-medium transition-colors"
    >
      {nextLocale === 'ko' ? '한국어' : 'EN'}
    </button>
  )
}
