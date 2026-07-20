import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')

  return (
    <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
      <h1 className="text-4xl font-bold tracking-tight">{t('greeting')}</h1>
      <p className="text-muted mt-4 text-lg">{t('tagline')}</p>
    </section>
  )
}
