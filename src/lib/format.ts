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

export const formatMonth = (locale: string, value: string | null | undefined): string => {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'short',
  }).format(new Date(value))
}
