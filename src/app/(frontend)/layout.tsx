import React from 'react'
import './globals.css'

export const metadata = {
  description: 'Seunghyun Lee (Jamkris) — portfolio and blog',
  title: 'Jamkris',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
