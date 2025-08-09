'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Menu } from 'lucide-react'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b">
          <div className="container mx-auto px-4 h-14 flex items-center">
            <button className="lg:hidden p-2 -ml-2" onClick={() => setIsOpen(true)}>
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
            <div className="ml-auto" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}


