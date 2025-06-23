import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'EvoluFlow - Plateforme de Gestion',
  description: 'Plateforme de gestion des utilisateurs et admissions EvoluFlow',
  generator: 'EvoluFlow',
  icons: {
    icon: '/logo1.png',
    shortcut: '/logo1.png',
    apple: '/logo1.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo1.png',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/logo1.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo1.png" />
        <meta name="theme-color" content="#3A90DA" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
