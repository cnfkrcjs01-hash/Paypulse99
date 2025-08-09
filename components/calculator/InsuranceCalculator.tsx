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
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Shield className="w-6 h-6 text-blue-600" />
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
        <div className="relative">
          <input
            type="text"
            value={baseSalary}
            onChange={(e) => setBaseSalary(formatInput(e.target.value))}
            placeholder="예: 3,500,000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-lg"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">원</span>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4" />
          {selectedYear}년 4대보험료율
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">국민연금</span>
            <span className="font-medium">{insuranceRates[selectedYear].nationalPension}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">건강보험</span>
            <span className="font-medium">{(insuranceRates[selectedYear].healthInsurance + insuranceRates[selectedYear].longTermCare).toFixed(3)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">고용보험</span>
            <span className="font-medium">{insuranceRates[selectedYear].employmentInsurance}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">산재보험</span>
            <span className="font-medium">{insuranceRates[selectedYear].industrialAccident}%</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleCalculate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          계산하기
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          초기화
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">계산 결과</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              title="국민연금"
              amount={results.nationalPension}
              percentage={insuranceRates[selectedYear].nationalPension}
              color="blue"
            />
            <ResultCard
              title="건강보험"
              amount={results.healthInsurance}
              percentage={insuranceRates[selectedYear].healthInsurance + insuranceRates[selectedYear].longTermCare}
              color="green"
              subtitle="장기요양보험 포함"
            />
            <ResultCard
              title="고용보험"
              amount={results.employmentInsurance}
              percentage={insuranceRates[selectedYear].employmentInsurance}
              color="purple"
            />
            <ResultCard
              title="산재보험"
              amount={results.industrialAccident}
              percentage={insuranceRates[selectedYear].industrialAccident}
              color="orange"
            />
          </div>

          <div className="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold mb-1">4대보험 총 부담금</h4>
                <p className="text-sm opacity-90">개인 + 회사 부담분</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatCurrency(results.total * 2)}</p>
                <p className="text-sm opacity-90">개인: {formatCurrency(results.total)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface ResultCardProps {
  title: string
  amount: number
  percentage: number
  color: 'blue' | 'green' | 'purple' | 'orange'
  subtitle?: string
}

function ResultCard({ title, amount, percentage, color, subtitle }: ResultCardProps) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50',
  }

  const textColorClasses = {
    blue: 'text-blue-800',
    green: 'text-green-800',
    purple: 'text-purple-800',
    orange: 'text-orange-800',
  }

  return (
    <div className={`p-4 border-2 rounded-lg ${colorClasses[color]}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className={`font-bold ${textColorClasses[color]}`}>{title}</h4>
          {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
        </div>
        <span className={`text-sm font-medium ${textColorClasses[color]}`}>
          {percentage}%
        </span>
      </div>
      <p className={`text-xl font-bold ${textColorClasses[color]}`}>
        {formatCurrency(amount)}
      </p>
      <p className="text-xs text-gray-600 mt-1">
        개인 부담분 (회사 부담: {formatCurrency(amount)})
      </p>
    </div>
  )
}


