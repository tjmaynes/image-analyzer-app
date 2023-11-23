import type { Metadata } from 'next'
import Container from '@mui/material/Container'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Web Playground',
  description:
    'A NextJS app that allows users to analyze images using MobileNet (in-browser), ChatGPT, and Cloudflare Workers',
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
          <Container>
            <Header />
            {children}
            <Footer />
          </Container>
        </main>
      </body>
    </html>
  )
}
