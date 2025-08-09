'use client'

import { useState } from 'react'
import { Clock, Calendar, Baby, Briefcase, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface AllowanceInputs {
  baseSalary: number
  workingDays: number
  workingHours: number
  overtimeHours: number
  nightHours: number
  holidayHours: number
  annualLeaveDays: number
  childcareMonths: number
  shortWorkHours: number
}

interface AllowanceResults {
  overtime: number
  night: number
  holiday: number
  annualLeave: number
  childcare: number
  shortWork: number
  total: number
}

export default function AllowanceCalculator() {
  const [inputs, setInputs] = useState<AllowanceInputs>({
    baseSalary: 0,
    workingDays: 22,
    workingHours: 8,
    overtimeHours: 0,
    nightHours: 0,
    holidayHours: 0,
    annualLeaveDays: 0,
    childcareMonths: 0,
    shortWorkHours: 0,
  })

  const [results, setResults] = useState<AllowanceResults | null>(null)

  const calculateAllowances = () => {
    const hourlyWage = inputs.baseSalary / (inputs.workingDays * inputs.workingHours)
    
    const calculated: AllowanceResults = {
      overtime: Math.floor(hourlyWage * inputs.overtimeHours * 1.5), // 연장근무 1.5배
      night: Math.floor(hourlyWage * inputs.nightHours * 0.5), // 야간근무 50% 추가
      holiday: Math.floor(hourlyWage * inputs.holidayHours * 1.5), // 휴일근무 1.5배
      annualLeave: Math.floor((inputs.baseSalary / inputs.workingDays) * inputs.annualLeaveDays), // 연차수당
      childcare: Math.floor(inputs.baseSalary * 0.4 * inputs.childcareMonths), // 육아휴직급여 40%
      shortWork: Math.floor(hourlyWage * inputs.shortWorkHours * 0.8), // 단축근로 80%
      total: 0
    }

    calculated.total = calculated.overtime + calculated.night + calculated.holiday + 
                     calculated.annualLeave + calculated.childcare + calculated.shortWork

    setResults(calculated)
  }

  const handleInputChange = (field: keyof AllowanceInputs, value: string) => {
    const numValue = parseInt(value) || 0
    setInputs(prev => ({
      ...prev,
      [field]: numValue
    }))
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">각종 수당 계산기</h2>
          <p className="text-gray-600">연장, 야간, 휴일, 연차, 육아휴직, 단축근로 수당을 계산합니다</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 입력 영역 */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">기본 정보 입력</h3>
          
          {/* 기본급 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">기본급 (월)</label>
            <input
              type="number"
              value={inputs.baseSalary || ''}
              onChange={(e) => handleInputChange('baseSalary', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="3500000"
            />
          </div>

          {/* 근무 조건 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">월 근무일수</label>
              <input
                type="number"
                value={inputs.workingDays}
                onChange={(e) => handleInputChange('workingDays', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">일 근무시간</label>
              <input
                type="number"
                value={inputs.workingHours}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* 추가 근무 시간 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              추가 근무 시간 (월간)
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">연장근무 (1.5배)</label>
                <input
                  type="number"
                  value={inputs.overtimeHours || ''}
                  onChange={(e) => handleInputChange('overtimeHours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  placeholder="20"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">야간근무 (+50%)</label>
                <input
                  type="number"
                  value={inputs.nightHours || ''}
                  onChange={(e) => handleInputChange('nightHours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">휴일근무 (1.5배)</label>
                <input
                  type="number"
                  value={inputs.holidayHours || ''}
                  onChange={(e) => handleInputChange('holidayHours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  placeholder="8"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">단축근로시간</label>
                <input
                  type="number"
                  value={inputs.shortWorkHours || ''}
                  onChange={(e) => handleInputChange('shortWorkHours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  placeholder="20"
                />
              </div>
            </div>
          </div>

          {/* 휴가/휴직 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              휴가/휴직 정보
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">연차 사용일수</label>
                <input
                  type="number"
                  value={inputs.annualLeaveDays || ''}
                  onChange={(e) => handleInputChange('annualLeaveDays', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">육아휴직 개월수</label>
                <input
                  type="number"
                  value={inputs.childcareMonths || ''}
                  onChange={(e) => handleInputChange('childcareMonths', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  placeholder="3"
                />
              </div>
            </div>
          </div>

          <button
            onClick={calculateAllowances}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            수당 계산하기
          </button>
        </div>

        {/* 결과 영역 */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">계산 결과</h3>
          
          {results ? (
            <div className="space-y-4">
              <AllowanceResultCard
                icon={<Clock className="w-5 h-5" />}
                title="연장근무수당"
                amount={results.overtime}
                detail={`${inputs.overtimeHours}시간 × 1.5배`}
                color="blue"
              />
              
              <AllowanceResultCard
                icon={<span className="text-lg">🌙</span>}
                title="야간근무수당"
                amount={results.night}
                detail={`${inputs.nightHours}시간 × 50% 추가`}
                color="indigo"
              />
              
              <AllowanceResultCard
                icon={<Calendar className="w-5 h-5" />}
                title="휴일근무수당"
                amount={results.holiday}
                detail={`${inputs.holidayHours}시간 × 1.5배`}
                color="purple"
              />
              
              <AllowanceResultCard
                icon={<span className="text-lg">🏖️</span>}
                title="연차수당"
                amount={results.annualLeave}
                detail={`${inputs.annualLeaveDays}일 사용`}
                color="green"
              />
              
              <AllowanceResultCard
                icon={<Baby className="w-5 h-5" />}
                title="육아휴직급여"
                amount={results.childcare}
                detail={`${inputs.childcareMonths}개월 × 40%`}
                color="pink"
              />
              
              <AllowanceResultCard
                icon={<Briefcase className="w-5 h-5" />}
                title="단축근로수당"
                amount={results.shortWork}
                detail={`${inputs.shortWorkHours}시간 × 80%`}
                color="orange"
              />

              {/* 총합 */}
              <div className="card bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-bold mb-1">총 수당</h4>
                    <p className="text-sm opacity-90">모든 수당의 합계</p>
                  </div>
                  <p className="text-3xl font-bold">{formatCurrency(results.total)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>기본 정보를 입력하고 계산하기 버튼을 눌러주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 수당 결과 카드
interface AllowanceResultCardProps {
  icon: React.ReactNode
  title: string
  amount: number
  detail: string
  color: string
}

function AllowanceResultCard({ icon, title, amount, detail, color }: AllowanceResultCardProps) {
  const colorClasses: { [key: string]: string } = {
    blue: 'border-blue-200 bg-blue-50 text-blue-800',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-800',
    purple: 'border-purple-200 bg-purple-50 text-purple-800',
    green: 'border-green-200 bg-green-50 text-green-800',
    pink: 'border-pink-200 bg-pink-50 text-pink-800',
    orange: 'border-orange-200 bg-orange-50 text-orange-800',
  }

  return (
    <div className={`p-4 border-2 rounded-lg ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/70 rounded-lg">
            {icon}
          </div>
          <div>
            <h4 className="font-bold">{title}</h4>
            <p className="text-sm opacity-75">{detail}</p>
          </div>
        </div>
        <p className="text-lg font-bold">
          {formatCurrency(amount)}
        </p>
      </div>
    </div>
  )
}


