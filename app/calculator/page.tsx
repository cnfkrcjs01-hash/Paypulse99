"use client"

import AllowanceCalculator from '@/components/calculator/AllowanceCalculator'
import InsuranceCalculator from '@/components/calculator/InsuranceCalculator'
import OKSidebar from '@/components/OKSidebar'
import OKTopBar from '@/components/OKTopBar'
import { Calculator, DollarSign, Home, Menu, Shield, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<'insurance' | 'allowance'>('insurance')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="page-background">
      <OKSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="lg:pl-72">
        <OKTopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* 네비게이션 버튼들 */}
        <div className="bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                홈으로
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Menu className="w-4 h-4" />
                메뉴 보기
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">인건비 계산기</h1>
          </div>
        </div>

        <main className="ok-section-unified">
          {/* 헤더 섹션 - OK저축은행 스타일 */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-4">
              <Calculator className="w-4 h-4" />
              정확한 인건비 계산
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">인건비 계산기</h1>
            <p className="text-xl text-gray-600">4대보험과 각종 수당을 정확하게 계산하세요</p>
          </div>

          {/* 탭 메뉴 - OK저축은행 스타일 */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('insurance')}
              className={`ok-tab ${activeTab === 'insurance'
                  ? 'ok-tab-active'
                  : 'ok-tab-inactive'
                }`}
            >
              <Shield className="w-5 h-5" />
              4대보험 계산기
            </button>
            <button
              onClick={() => setActiveTab('allowance')}
              className={`ok-tab ${activeTab === 'allowance'
                  ? 'ok-tab-active'
                  : 'ok-tab-inactive'
                }`}
            >
              <DollarSign className="w-5 h-5" />
              각종 수당 계산기
            </button>
          </div>

          {/* 계산기 컨텐츠 */}
          <div className="space-y-8">
            {activeTab === 'insurance' && <InsuranceCalculator />}
            {activeTab === 'allowance' && <AllowanceCalculator />}
          </div>

          {/* 도움말 - OK저축은행 스타일 */}
          <div className="ok-card bg-orange-50 border-orange-200 mt-12">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-200 rounded-full text-orange-800 text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                계산기 사용 팁
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  4대보험 계산기
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    기본급 기준으로 개인 부담분을 계산합니다
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    회사 부담분은 개인 부담분과 동일합니다
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    최신 보험료율이 자동 적용됩니다
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    장기요양보험은 건강보험에 포함됩니다
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  수당 계산기
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    연장근무: 기본시급의 1.5배
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    야간근무: 기본시급의 50% 추가
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    휴일근무: 기본시급의 1.5배
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    육아휴직: 월급여의 40% (최대 150만원)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 추가 정보 - OK저축은행 스타일 */}
          <div className="ok-card bg-gradient-to-br from-gray-50/80 to-orange-50/80 backdrop-blur-sm border-orange-200 mt-8">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">더 정확한 계산이 필요하신가요?</h3>
              <p className="text-gray-600 mb-4">
                AI 분석 기능을 통해 더 상세한 인건비 분석과 절약 방안을 제시해드립니다
              </p>
              <button className="ok-btn-primary">
                AI 분석 시작하기
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


