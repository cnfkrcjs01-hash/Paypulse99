'use client'

import { Menu, Bell, Search, Sun, Moon } from 'lucide-react'
import { useState } from 'react'

interface TopBarProps {
  onMenuClick: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [isDark, setIsDark] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
      <div className="flex items-center justify-between h-16 px-6">
        {/* 왼쪽 - 메뉴 버튼 & 검색 */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="hidden md:flex items-center gap-2 bg-slate-100/70 rounded-full px-4 py-2 min-w-[300px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              className="bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 flex-1"
            />
          </div>
        </div>

        {/* 오른쪽 - 알림 & 설정 */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-400 rounded-full"></span>
          </button>
          
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-slate-600" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          <div className="w-8 h-8 bg-gradient-to-br from-rose-200 to-pink-300 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow">
            <span className="text-rose-700 font-semibold text-sm">원</span>
          </div>
        </div>
      </div>
    </header>
  )
}


