import type { Metadata } from 'next'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Image Analyzer',
  description:
    'a NextJS app that allows users to analyze images using MobileNet (via TensorflowJS), ChatGPT, and Cloudflare Pages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <Header />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}
