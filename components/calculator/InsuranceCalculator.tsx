'use client'

import { useState } from 'react'
import { Calculator, Shield, Info, RefreshCw } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface InsuranceResult {
  nationalPension: number
  healthInsurance: number
  employmentInsurance: number
  industrialAccident: number
  total: number
}

export default function InsuranceCalculator() {
  const [baseSalary, setBaseSalary] = useState<string>('')
  const [results, setResults] = useState<InsuranceResult | null>(null)
  const [selectedYear, setSelectedYear] = useState<2024 | 2025>(2024)

  const insuranceRates = {
    2024: {
      nationalPension: 4.5,
      healthInsurance: 3.545,
      longTermCare: 0.4581,
      employmentInsurance: 0.9,
      industrialAccident: 0.7,
    },
    2025: {
      nationalPension: 4.5,
      healthInsurance: 3.545,
      longTermCare: 0.4581,
      employmentInsurance: 0.9,
      industrialAccident: 0.73,
    }
  }

  const handleCalculate = () => {
    const salary = parseInt(baseSalary.replace(/,/g, ''))
    if (isNaN(salary) || salary <= 0) return

    const rates = insuranceRates[selectedYear]
    const healthTotal = rates.healthInsurance + rates.longTermCare

    const result: InsuranceResult = {
      nationalPension: Math.floor(salary * (rates.nationalPension / 100)),
      healthInsurance: Math.floor(salary * (healthTotal / 100)),
      employmentInsurance: Math.floor(salary * (rates.employmentInsurance / 100)),
      industrialAccident: Math.floor(salary * (rates.industrialAccident / 100)),
      total: 0
    }

    result.total = result.nationalPension + result.healthInsurance + result.employmentInsurance + result.industrialAccident
    setResults(result)
  }

  const handleReset = () => {
    setBaseSalary('')
    setResults(null)
  }

  const formatInput = (value: string) => {
    const number = value.replace(/[^0-9]/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <div className="ok-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-ok-blue-100 rounded-lg">
          <Shield className="w-6 h-6 text-ok-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">4대보험 계산기</h2>
          <p className="text-gray-600">국민연금, 건강보험, 고용보험, 산재보험을 자동 계산합니다</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">적용 연도</label>
        <div className="flex gap-2">
          {[2024, 2025].map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year as 2024 | 2025)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedYear === year
                  ? 'ok-btn-primary'
                  : 'ok-btn-outline'
              }`}
            >
              {year}년
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          기본급 (월급여)
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={baseSalary}
            onChange={(e) => setBaseSalary(formatInput(e.target.value))}
            placeholder="예: 3,000,000"
            className="ok-input flex-1"
          />
          <button
            onClick={handleCalculate}
            disabled={!baseSalary}
            className="ok-btn-primary px-6"
          >
            계산하기
          </button>
        </div>
      </div>

      {/* 계산 결과 */}
      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              title="국민연금"
              amount={results.nationalPension}
              percentage={insuranceRates[selectedYear].nationalPension}
              color="blue"
              subtitle="개인부담"
            />
            <ResultCard
              title="건강보험"
              amount={results.healthInsurance}
              percentage={insuranceRates[selectedYear].healthInsurance + insuranceRates[selectedYear].longTermCare}
              color="green"
              subtitle="개인부담"
            />
            <ResultCard
              title="고용보험"
              amount={results.employmentInsurance}
              percentage={insuranceRates[selectedYear].employmentInsurance}
              color="purple"
              subtitle="개인부담"
            />
            <ResultCard
              title="산재보험"
              amount={results.industrialAccident}
              percentage={insuranceRates[selectedYear].industrialAccident}
              color="orange"
              subtitle="개인부담"
            />
          </div>

          {/* 총계 */}
          <div className="ok-card-primary p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">총 보험료</h3>
                <p className="text-gray-600">개인 부담분</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(results.total)}
                </p>
                <p className="text-sm text-gray-600">
                  월 {formatCurrency(results.total)}원
                </p>
              </div>
            </div>
          </div>

          {/* 회사 부담분 */}
          <div className="ok-card bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">회사 부담분</h3>
                <p className="text-gray-600">동일한 금액</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(results.total)}
                </p>
                <p className="text-sm text-gray-600">
                  월 {formatCurrency(results.total)}원
                </p>
              </div>
            </div>
          </div>

          {/* 연간 총액 */}
          <div className="ok-card bg-gradient-to-r from-ok-blue-50 to-indigo-50 border-ok-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">연간 총액</h3>
                <p className="text-gray-600">개인 + 회사 부담분</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(results.total * 24)}
                </p>
                <p className="text-sm text-gray-600">
                  연 {formatCurrency(results.total * 24)}원
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 도움말 */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <h4 className="font-semibold mb-2">💡 계산 기준</h4>
            <ul className="space-y-1">
              <li>• 국민연금: 기본급의 4.5% (개인부담)</li>
              <li>• 건강보험: 기본급의 3.545% + 장기요양보험 0.4581%</li>
              <li>• 고용보험: 기본급의 0.9% (개인부담)</li>
              <li>• 산재보험: 기본급의 0.7% (회사부담, 개인부담 없음)</li>
              <li>• 모든 보험료는 월 기본급 기준으로 계산됩니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 리셋 버튼 */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleReset}
          className="ok-btn-outline flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          다시 계산
        </button>
      </div>
    </div>
  )
}

// 결과 카드 컴포넌트
interface ResultCardProps {
  title: string
  amount: number
  percentage: number
  color: 'blue' | 'green' | 'purple' | 'orange'
  subtitle?: string
}

function ResultCard({ title, amount, percentage, color, subtitle }: ResultCardProps) {
  const colorClasses = {
    blue: 'from-ok-blue-500 to-ok-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <div className={`ok-card bg-gradient-to-r ${colorClasses[color]} text-white border-none`}>
      <div className="text-center">
        <h3 className="font-semibold mb-1">{title}</h3>
        {subtitle && <p className="text-xs opacity-80 mb-2">{subtitle}</p>}
        <p className="text-2xl font-bold mb-1">{formatCurrency(amount)}</p>
        <p className="text-sm opacity-80">{percentage}%</p>
      </div>
    </div>
  )
}



