'use client'

import { useTranslations } from 'next-intl'
import React, { useActionState } from 'react'

import { submitContact, type ContactState } from '@/app/actions/contact'

const initialState: ContactState = { status: 'idle' }

export function ContactForm() {
  const t = useTranslations('contactForm')
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  if (state.status === 'success') {
    return (
      <div className="border-accent/40 bg-accent/5 mx-auto mt-9 max-w-md rounded-lg border px-6 py-8 text-center">
        <p className="text-accent font-mono text-sm tracking-wider uppercase">{t('sentTitle')}</p>
        <p className="text-muted mt-2 text-sm">{t('sentBody')}</p>
      </div>
    )
  }

  const errorText =
    state.status === 'error' ? t(`errors.${state.message ?? 'server'}`) : null

  return (
    <form action={formAction} className="mx-auto mt-9 max-w-md text-left">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          required
          maxLength={100}
          placeholder={t('name')}
          className="border-border bg-surface/40 focus:border-accent w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors"
        />
        <input
          type="email"
          name="email"
          required
          maxLength={200}
          placeholder={t('email')}
          className="border-border bg-surface/40 focus:border-accent w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors"
        />
      </div>
      <textarea
        name="message"
        required
        rows={4}
        maxLength={5000}
        placeholder={t('message')}
        className="border-border bg-surface/40 focus:border-accent mt-3 w-full resize-y rounded-lg border px-4 py-3 text-sm outline-none transition-colors"
      />
      {errorText && <p className="text-accent mt-3 text-sm">{errorText}</p>}
      <button
        type="submit"
        disabled={pending}
        className="font-mono border-accent/50 hover:border-accent bg-accent/5 hover:bg-accent/10 mt-4 w-full rounded-lg border px-6 py-3.5 text-sm transition-colors disabled:opacity-50"
      >
        {pending ? t('sending') : `${t('send')} ↗`}
      </button>
    </form>
  )
}
