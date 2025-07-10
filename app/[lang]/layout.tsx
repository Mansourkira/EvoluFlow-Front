import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import {NextIntlClientProvider, hasLocale, useMessages} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/app/i18n/routing';
import { Languages } from 'lucide-react';
 import LocaleSwitcher from '@/components/localeswitcher';




export const metadata: Metadata = {
  title: 'EvoluFlow V1.0',
  description: 'Plateforme de gestion des utilisateurs et admissions EvoluFlow',
  generator: 'EvoluFlow V1.0',
  icons: {
    icon: '/sigle1.png',
    shortcut: '/sigle1.png',
    apple: '/sigle1.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/sigle1.png',
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

export  async function LocaleLayout({ children, params: { lang } }: Props) {
  if (!locales.includes(lang as any)) notFound();

  const messages = await getMessages();

  return (
    <html lang={lang}>
      <body>
        <header style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Mon Site Multi-langue</h1>
          <LocaleSwitcher /> {/* Intégration du sélecteur de langue */}
        </header>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
