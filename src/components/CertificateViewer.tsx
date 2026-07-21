'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

interface CertificateViewerProps {
  name: string
  url: string
  mimeType?: string | null
  thumbUrl?: string | null
}

// Thumbnail/chip trigger that opens the certificate (image or PDF) in a modal viewer
export function CertificateViewer({ name, url, mimeType, thumbUrl }: CertificateViewerProps) {
  const [open, setOpen] = useState(false)
  const t = useTranslations('about')

  const isImage = (mimeType ?? '').startsWith('image/')
  const isPdf = (mimeType ?? '') === 'application/pdf'

  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('viewCertificate')}
        className="group shrink-0"
      >
        {isImage && thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbUrl}
            alt={name}
            className="border-border group-hover:border-accent h-16 w-24 rounded-md border object-cover transition-colors"
          />
        ) : (
          <span className="font-mono border-border text-muted group-hover:border-accent group-hover:text-accent inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs transition-colors">
            {isPdf ? 'PDF' : '📄'} {t('viewCertificate')} ↗
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-3xl flex-col"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="truncate text-sm font-medium text-white">{name}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="font-mono shrink-0 rounded-md border border-white/30 px-3 py-1.5 text-xs text-white transition-colors hover:border-white"
                >
                  {t('close')} ✕
                </button>
              </div>
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={name}
                  className="max-h-[80vh] w-full rounded-lg bg-white object-contain"
                />
              ) : isPdf ? (
                <iframe
                  src={url}
                  title={name}
                  className="h-[80vh] w-full rounded-lg border-0 bg-white"
                />
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/10 px-6 py-8 text-center text-white"
                >
                  {t('download')} ↗
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
