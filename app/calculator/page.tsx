"use client"

import { useState } from 'react'
import InsuranceCalculator from '@/components/calculator/InsuranceCalculator'
import AllowanceCalculator from '@/components/calculator/AllowanceCalculator'
import { Shield, DollarSign } from 'lucide-react'

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<'insurance' | 'allowance'>('insurance')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">인건비 계산기</h1>
        <p className="text-gray-600 mt-2">4대보험과 각종 수당을 정확하게 계산하세요</p>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('insurance')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
            activeTab === 'insurance'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          <Shield className="w-5 h-5" />
          4대보험 계산기
        </button>
        <button
          onClick={() => setActiveTab('allowance')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
            activeTab === 'allowance'
              ? 'border-green-500 text-green-600 bg-green-50'
              : 'border-transparent text-gray-600 hover:text-gray-800'
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

      {/* 도움말 */}
      <div className="mt-12 card bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800 mb-4">💡 계산기 사용 팁</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">4대보험 계산기</h4>
            <ul className="space-y-1">
              <li>• 기본급 기준으로 개인 부담분을 계산합니다</li>
              <li>• 회사 부담분은 개인 부담분과 동일합니다</li>
              <li>• 최신 보험료율이 자동 적용됩니다</li>
              <li>• 장기요양보험은 건강보험에 포함됩니다</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">수당 계산기</h4>
            <ul className="space-y-1">
              <li>• 연장근무: 기본시급의 1.5배</li>
              <li>• 야간근무: 기본시급의 50% 추가</li>
              <li>• 휴일근무: 기본시급의 1.5배</li>
              <li>• 육아휴직: 월급여의 40% (최대 150만원)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


