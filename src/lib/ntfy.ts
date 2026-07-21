import { getPayloadClient } from '@/lib/payload'

interface NtfyOptions {
  tags?: string
  priority?: string
}

const SEND_TIMEOUT_MS = 8000

// Strip non-ASCII so the value is safe to place in an HTTP header (ntfy Title).
const asciiHeader = (value: string): string => value.replace(/[^\x20-\x7E]/g, '').trim()

// Publish a message to the ntfy topic configured in the admin. Never throws —
// a failed notification must not break the caller (the message is already saved).
export async function sendNtfy(
  title: string,
  message: string,
  opts: NtfyOptions = {},
): Promise<boolean> {
  try {
    const payload = await getPayloadClient()
    const config = await payload.findGlobal({ slug: 'notifications', overrideAccess: true })

    if (!config?.enabled) {
      return false
    }

    const base = (config.ntfyUrl ?? '').trim().replace(/\/+$/, '')
    const topic = (config.ntfyTopic ?? '').trim()
    if (!base || !topic) {
      return false
    }

    const headers: Record<string, string> = {
      'Content-Type': 'text/plain; charset=utf-8',
      Title: asciiHeader(title) || 'Notification',
    }
    if (opts.tags) {
      headers.Tags = opts.tags
    }
    if (opts.priority) {
      headers.Priority = opts.priority
    }
    const token = (config.ntfyToken ?? '').trim()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(`${base}/${topic}`, {
      method: 'POST',
      body: message,
      headers,
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    })

    return res.ok
  } catch {
    return false
  }
}
