'use client'

import { Menu, Bell, Search, User, Settings, HelpCircle } from 'lucide-react'

interface OKTopBarProps {
  onMenuClick: () => void
}

export default function OKTopBar({ onMenuClick }: OKTopBarProps) {
  return (
    <header className="ok-header sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        {/* 왼쪽 - 메뉴 버튼 */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="hidden lg:block">
            <h2 className="text-lg font-bold text-gray-900">인건비 관리 시스템</h2>
            <p className="text-sm text-gray-500">PayPulse Dashboard</p>
          </div>
        </div>

        {/* 가운데 - 검색바 */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50/80 backdrop-blur-sm rounded-xl px-4 py-2 min-w-[400px]">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="직원명, 부서, 계산 항목 등을 검색하세요..."
            className="bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 flex-1"
          />
          <button className="ok-btn-primary text-sm py-1 px-3">
            검색
          </button>
        </div>

        {/* 오른쪽 - 사용자 메뉴 */}
        <div className="flex items-center gap-2">
          <button className="relative p-3 hover:bg-gray-100/80 backdrop-blur-sm rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <button className="p-3 hover:bg-gray-100/80 backdrop-blur-sm rounded-xl transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          <button className="p-3 hover:bg-gray-100/80 backdrop-blur-sm rounded-xl transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-3 ml-2 p-2 hover:bg-gray-100/80 backdrop-blur-sm rounded-xl transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
              원
            </div>
            <div className="hidden md:block">
              <div className="font-semibold text-gray-900">원이님</div>
              <div className="text-sm text-gray-500">인사팀</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
