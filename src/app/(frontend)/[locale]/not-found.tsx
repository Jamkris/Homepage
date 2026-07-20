import { useTranslations } from 'next-intl'
import React from 'react'

import { Link } from '@/i18n/navigation'

export default function NotFoundPage() {
  const t = useTranslations('notFound')

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
      <p className="text-muted text-sm font-medium">404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">{t('title')}</h1>
      <Link
        href="/"
        className="text-accent mt-6 text-sm font-medium underline underline-offset-4"
      >
        {t('back')}
      </Link>
    </div>
  )
}
