import { Open_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const openSans = Open_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'Vopy Remittance Demo',
  description: 'A modern remittance transfer application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={openSans.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen bg-[#FCF7F1]">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
