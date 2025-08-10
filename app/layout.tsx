import Navigation from '@/components/Navigation'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const notoSansKR = Noto_Sans_KR({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-noto'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <title>PayPulse - 스마트 인건비 관리</title>
        <meta name="description" content="AI 기반 통합 인건비 관리 시스템" />
      </head>
      <body className={`${inter.className} ${notoSansKR.variable} font-noto`}>
        <div className="min-h-screen bg-white">
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}


