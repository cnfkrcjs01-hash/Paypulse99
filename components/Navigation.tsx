'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Upload, BarChart3, Calculator, MessageCircle } from 'lucide-react'

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '업로드', href: '/upload', icon: Upload },
  { name: '대시보드', href: '/dashboard', icon: BarChart3 },
  { name: '계산기', href: '/calculator', icon: Calculator },
  { name: 'AI 인사이트', href: '/ai-chat', icon: MessageCircle },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PayPulse
            </span>
          </Link>

          <div className="flex space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}


