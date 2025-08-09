'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, Upload, BarChart3, Calculator, MessageCircle, 
  X, Settings, HelpCircle, User, ChevronLeft
} from 'lucide-react'

const navigation = [
  { name: '홈', href: '/', icon: Home, color: 'rose' },
  { name: '데이터 업로드', href: '/upload', icon: Upload, color: 'blue' },
  { name: '대시보드', href: '/dashboard', icon: BarChart3, color: 'emerald' },
  { name: '계산기', href: '/calculator', icon: Calculator, color: 'purple' },
  { name: 'AI 인사이트', href: '/ai-chat', icon: MessageCircle, color: 'amber' },
]

const bottomNavigation = [
  { name: '설정', href: '/settings', icon: Settings },
  { name: '도움말', href: '/help', icon: HelpCircle },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 h-full bg-white/80 backdrop-blur-xl border-r border-slate-200/50 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-72 lg:w-64
      `}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-200 to-pink-300 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-rose-700 font-bold text-lg">PP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                PayPulse
              </h1>
              <p className="text-xs text-slate-500">스마트 인건비 관리</p>
            </div>
          </Link>
          
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">원이님</p>
              <p className="text-sm text-slate-500">인사팀 급여파트</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
            메인 메뉴
          </div>
          
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? `bg-gradient-to-r ${getActiveGradient(item.color)} text-white shadow-lg` 
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                <div className={`
                  p-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-white/20' 
                    : `${getIconBackground(item.color)} group-hover:scale-110`
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto">
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200/50 space-y-2">
          {bottomNavigation.map((item) => {
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100/70 rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

function getActiveGradient(color: string): string {
  const gradients: { [key: string]: string } = {
    rose: 'from-rose-400 to-pink-500',
    blue: 'from-blue-400 to-indigo-500',
    emerald: 'from-emerald-400 to-teal-500',
    purple: 'from-purple-400 to-violet-500',
    amber: 'from-amber-400 to-orange-500',
  }
  return gradients[color] || 'from-slate-400 to-slate-500'
}

function getIconBackground(color: string): string {
  const backgrounds: { [key: string]: string } = {
    rose: 'bg-rose-50 text-rose-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  }
  return backgrounds[color] || 'bg-slate-50 text-slate-600'
}


