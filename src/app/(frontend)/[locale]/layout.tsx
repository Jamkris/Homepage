import type { Metadata, Viewport } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { JetBrains_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Cursor } from '@/components/fx/Cursor'
import { routing } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { SERVER_URL } from '@/lib/seo'

import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import '../globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const seo = settings.seo ?? {}
  const siteName = settings.siteName || 'Jamkris'
  const description = settings.description || 'Seunghyun Lee (Jamkris) — portfolio and blog'
  const keywords = (seo.keywords ?? []).filter(Boolean) as string[]

  const other: Record<string, string> = {}
  if (seo.naverVerification) {
    other['naver-site-verification'] = seo.naverVerification
  }

  return {
    metadataBase: new URL(SERVER_URL),
    title: { default: siteName, template: `%s | ${siteName}` },
    description,
    keywords: keywords.length ? keywords : undefined,
    openGraph: { siteName, type: 'website' },
    verification: seo.googleVerification ? { google: seo.googleVerification } : undefined,
    other: Object.keys(other).length ? other : undefined,
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfcfc' },
    { media: '(prefers-color-scheme: dark)', color: '#1b1b1e' },
  ],
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const seo = settings.seo ?? {}

  // JSON-LD Person — helps search engines connect the name + school + links
  const personName = seo.personName
  const jsonLd = personName
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personName,
        alternateName: (seo.alternateNames ?? []).filter(Boolean),
        url: SERVER_URL,
        jobTitle: seo.jobTitle || undefined,
        affiliation: seo.affiliation
          ? { '@type': 'Organization', name: seo.affiliation }
          : undefined,
        alumniOf: seo.affiliation || undefined,
        sameAs: (settings.socials ?? [])
          .filter((s) => s.platform !== 'email')
          .map((s) => s.url),
      }
    : null

  return (
    <html lang={locale} suppressHydrationWarning className={jetbrainsMono.variable}>
      <body className="flex min-h-screen flex-col">
        {jsonLd && (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider>
            <Cursor />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
