'use server'

import { getPayloadClient } from '@/lib/payload'
import { sendNtfy } from '@/lib/ntfy'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME = 100
const MAX_EMAIL = 200
const MAX_MESSAGE = 5000

// Validate + persist a contact submission, then fire a best-effort ntfy push.
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot — real users never fill this hidden field
  if (((formData.get('company') as string) ?? '').trim() !== '') {
    return { status: 'success' }
  }

  const name = ((formData.get('name') as string) ?? '').trim()
  const email = ((formData.get('email') as string) ?? '').trim()
  const message = ((formData.get('message') as string) ?? '').trim()

  if (!name || !email || !message) {
    return { status: 'error', message: 'required' }
  }
  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return { status: 'error', message: 'tooLong' }
  }
  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'email' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contacts',
      data: { name, email, message },
    })
  } catch {
    return { status: 'error', message: 'server' }
  }

  // Non-fatal: the message is already saved even if the push fails
  await sendNtfy('New contact message', `${name} <${email}>\n\n${message}`, {
    tags: 'email,homepage',
    priority: 'high',
  })

  return { status: 'success' }
}
