'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  Home, Upload, BarChart3, Calculator, MessageCircle, 
  Menu, X, Settings, HelpCircle, User, Bell, Search,
  ChevronRight, Building2, DollarSign
} from 'lucide-react'

const navigation = [
  { name: '홈', href: '/', icon: Home, description: '메인 대시보드' },
  { name: '통합데이터업로드', href: '/upload', icon: Upload, description: '급여대장 및 수수료 파일 업로드' },
  { name: '현황 대시보드', href: '/dashboard', icon: BarChart3, description: '실시간 인건비 현황' },
          { name: '인건비', href: '/total-labor-cost', icon: DollarSign, description: '직접/간접 인건비 분석' },
  { name: '인건비 계산기', href: '/calculator', icon: Calculator, description: '4대보험 및 수당 계산' },
  { name: 'AI 인사이트', href: '/ai-chat', icon: MessageCircle, description: '스마트 분석 서비스' },
]

const quickActions = [
  { name: '통합한도조회', href: '/limits' },
  { name: '인건비 분석', href: '/analysis' },
  { name: '보고서 생성', href: '/reports' },
  { name: '계산기 바로가기', href: '/calculator' },
]

interface OKSidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function OKSidebar({ isOpen, setIsOpen }: OKSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div className={`
        fixed top-0 left-0 h-full ok-sidebar
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-80 lg:w-72
      `}>
        {/* 로고 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PayPulse</h1>
              <p className="text-sm text-gray-500">스마트 인건비 관리</p>
            </div>
          </Link>
          
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* 사용자 정보 */}
        <div className="p-6 border-b border-gray-100">
          <div className="ok-card-primary p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                원
              </div>
              <div>
                <p className="font-bold text-gray-900">원이님</p>
                <p className="text-sm text-gray-600">인사팀 급여파트</p>
              </div>
            </div>
            <div className="text-sm text-orange-600">
              <span className="font-semibold">오늘의 작업:</span> 급여 계산 완료
            </div>
          </div>
        </div>

        {/* 빠른 작업 */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            빠른 작업
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="p-3 text-center bg-gray-50/80 backdrop-blur-sm hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all text-sm font-medium"
              >
                {action.name}
              </Link>
            ))}
          </div>
        </div>

        {/* 메인 네비게이션 */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-orange-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className={`text-xs ${isActive ? 'text-orange-100' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                  
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:translate-x-1'
                  }`} />
                </Link>
              )
            })}
          </div>
        </nav>

        {/* 하단 정보 */}
        <div className="p-6 border-t border-gray-100">
          <div className="ok-card p-4 text-center">
            <div className="text-sm text-gray-600 mb-2">
              📞 고객지원센터
            </div>
            <div className="font-bold text-orange-600 text-lg">
              1588-0000
            </div>
            <div className="text-xs text-gray-500 mt-1">
              평일 09:00 ~ 18:00
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
