'use client'

import { BarChart3, Calculator, FileText, HelpCircle, Home, MessageCircle, Settings, TrendingUp, Upload, Bell } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '업로드', href: '/upload', icon: Upload },
  { name: '대시보드', href: '/dashboard', icon: BarChart3 },
  { name: '분석', href: '/analytics', icon: TrendingUp },
  { name: '보고서', href: '/reports', icon: FileText },
  { name: '계산기', href: '/calculator', icon: Calculator },
  { name: 'AI 인사이트', href: '/ai-chat', icon: MessageCircle },
  { name: '알림', href: '/notifications', icon: Bell },
  { name: '설정', href: '/settings', icon: Settings },
  { name: '도움말', href: '/help', icon: HelpCircle },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="ok-header fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
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
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
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






