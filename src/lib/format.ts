export const formatDate = (locale: string, value: string | null | undefined): string => {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

// Numeric year.month — e.g. 2023.01 (locale-independent; UTC to avoid off-by-one)
export const formatMonth = (_locale: string, value: string | null | undefined): string => {
  if (!value) {
    return ''
  }

  const d = new Date(value)
  return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

// Flatten a Lexical rich-text value into a plain-text excerpt
export const richTextToPlainText = (data: unknown, max = 120): string => {
  const root = (data as { root?: { children?: unknown[] } } | null)?.root
  if (!root?.children) {
    return ''
  }

  const parts: string[] = []
  const walk = (nodes: unknown[]): void => {
    for (const n of nodes) {
      if (!n || typeof n !== 'object') {
        continue
      }
      const node = n as { text?: string; children?: unknown[] }
      if (typeof node.text === 'string') {
        parts.push(node.text)
      }
      if (Array.isArray(node.children)) {
        walk(node.children)
      }
    }
  }
  walk(root.children)

  const text = parts.join(' ').replace(/\s+/g, ' ').trim()
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

// Display a URL with the middle elided — e.g. figma.com/des...8eY0-1
// (strips the protocol; the full URL should stay as the href)
export const truncateUrl = (url: string, head = 16, tail = 7): string => {
  const display = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  if (display.length <= head + tail + 1) {
    return display
  }
  return `${display.slice(0, head)}…${display.slice(-tail)}`
}

// Numeric year.month.day — e.g. 2023.04.05
export const formatFullDate = (_locale: string, value: string | null | undefined): string => {
  if (!value) {
    return ''
  }

  const d = new Date(value)
  return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(
    d.getUTCDate(),
  ).padStart(2, '0')}`
}
