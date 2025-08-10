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
    <div className="ok-card">
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
              className="ok-input"
              placeholder="3500000"
            />
          </div>

          {/* 근무 조건 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">월 근무일수</label>
              <input
                type="number"
                value={inputs.workingDays || ''}
                onChange={(e) => handleInputChange('workingDays', e.target.value)}
                className="ok-input"
                placeholder="22"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">일 근무시간</label>
              <input
                type="number"
                value={inputs.workingHours || ''}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
                className="ok-input"
                placeholder="8"
              />
            </div>
          </div>

          {/* 수당 입력 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">수당 계산 항목</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연장근무 (시간)</label>
                <input
                  type="number"
                  value={inputs.overtimeHours || ''}
                  onChange={(e) => handleInputChange('overtimeHours', e.target.value)}
                  className="ok-input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">야간근무 (시간)</label>
                <input
                  type="number"
                  value={inputs.nightHours || ''}
                  onChange={(e) => handleInputChange('nightHours', e.target.value)}
                  className="ok-input"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">휴일근무 (시간)</label>
                <input
                  type="number"
                  value={inputs.holidayHours || ''}
                  onChange={(e) => handleInputChange('holidayHours', e.target.value)}
                  className="ok-input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연차 사용일</label>
                <input
                  type="number"
                  value={inputs.annualLeaveDays || ''}
                  onChange={(e) => handleInputChange('annualLeaveDays', e.target.value)}
                  className="ok-input"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">육아휴직 (개월)</label>
                <input
                  type="number"
                  value={inputs.childcareMonths || ''}
                  onChange={(e) => handleInputChange('childcareMonths', e.target.value)}
                  className="ok-input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">단축근로 (시간)</label>
                <input
                  type="number"
                  value={inputs.shortWorkHours || ''}
                  onChange={(e) => handleInputChange('shortWorkHours', e.target.value)}
                  className="ok-input"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* 계산 버튼 */}
          <button
            onClick={calculateAllowances}
            disabled={!inputs.baseSalary}
            className="ok-btn-primary w-full py-3"
          >
            수당 계산하기
          </button>
        </div>

        {/* 결과 영역 */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">계산 결과</h3>
          
          {results ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <AllowanceResultCard
                  icon={<Clock className="w-5 h-5" />}
                  title="연장근무 수당"
                  amount={results.overtime}
                  detail="기본시급 × 1.5배"
                  color="from-blue-500 to-blue-600"
                />
                <AllowanceResultCard
                  icon={<Clock className="w-5 h-5" />}
                  title="야간근무 수당"
                  amount={results.night}
                  detail="기본시급 × 50% 추가"
                  color="from-indigo-500 to-indigo-600"
                />
                <AllowanceResultCard
                  icon={<Calendar className="w-5 h-5" />}
                  title="휴일근무 수당"
                  amount={results.holiday}
                  detail="기본시급 × 1.5배"
                  color="from-purple-500 to-purple-600"
                />
                <AllowanceResultCard
                  icon={<Calendar className="w-5 h-5" />}
                  title="연차 수당"
                  amount={results.annualLeave}
                  detail="일일 기본급"
                  color="from-green-500 to-green-600"
                />
                <AllowanceResultCard
                  icon={<Baby className="w-5 h-5" />}
                  title="육아휴직 급여"
                  amount={results.childcare}
                  detail="월 기본급 × 40%"
                  color="from-pink-500 to-pink-600"
                />
                <AllowanceResultCard
                  icon={<Briefcase className="w-5 h-5" />}
                  title="단축근로 수당"
                  amount={results.shortWork}
                  detail="기본시급 × 80%"
                  color="from-orange-500 to-orange-600"
                />
              </div>

              {/* 총계 */}
              <div className="ok-card-primary p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">총 수당</h3>
                <p className="text-4xl font-bold text-gray-800">
                  {formatCurrency(results.total)}
                </p>
                <p className="text-gray-600 mt-2">월 수당 총액</p>
              </div>
            </div>
          ) : (
            <div className="ok-card bg-gray-50 p-8 text-center">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">수당 계산 준비</h3>
              <p className="text-gray-500">왼쪽에 정보를 입력하고 계산하기 버튼을 클릭하세요</p>
            </div>
          )}
        </div>
      </div>

      {/* 도움말 */}
      <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-4">💡 수당 계산 기준</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-green-700">
          <div>
            <h4 className="font-semibold mb-2">근무 관련 수당</h4>
            <ul className="space-y-1">
              <li>• 연장근무: 기본시급 × 1.5배</li>
              <li>• 야간근무: 기본시급 × 50% 추가</li>
              <li>• 휴일근무: 기본시급 × 1.5배</li>
              <li>• 단축근로: 기본시급 × 80%</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">휴가 관련 수당</h4>
            <ul className="space-y-1">
              <li>• 연차수당: 일일 기본급</li>
              <li>• 육아휴직: 월 기본급 × 40% (최대 150만원)</li>
              <li>• 기본시급 = 월 기본급 ÷ (월 근무일수 × 일 근무시간)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// 수당 결과 카드 컴포넌트
interface AllowanceResultCardProps {
  icon: React.ReactNode
  title: string
  amount: number
  detail: string
  color: string
}

function AllowanceResultCard({ icon, title, amount, detail, color }: AllowanceResultCardProps) {
  return (
    <div className={`ok-card bg-gradient-to-r ${color} text-white border-none`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm opacity-80 mb-2">{detail}</p>
          <p className="text-xl font-bold">{formatCurrency(amount)}</p>
        </div>
      </div>
    </div>
  )
}



