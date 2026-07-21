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
