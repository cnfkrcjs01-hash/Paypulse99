'use client'

import { FeeData, PayrollData } from '@/types/payroll'
import { BarChart3, Building2, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'

interface IntegratedDataPreviewProps {
  payrollData: PayrollData[]
  feeData: FeeData[]
}

export default function IntegratedDataPreview({ payrollData, feeData }: IntegratedDataPreviewProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'payroll' | 'fee'>('summary')

  // 디버깅을 위한 로그 추가
  console.log('=== IntegratedDataPreview 렌더링 ===')
  console.log('급여 데이터:', payrollData)
  console.log('수수료 데이터:', feeData)
  console.log('급여 데이터 개수:', payrollData.length)
  console.log('수수료 데이터 개수:', feeData.length)
  console.log('급여 데이터 샘플:', payrollData.slice(0, 2))
  console.log('수수료 데이터 샘플:', feeData.slice(0, 2))

  // 데이터 유효성 검사
  const validPayrollData = payrollData.filter(item =>
    item &&
    item.employeeName &&
    item.totalPayroll > 0 &&
    typeof item.totalPayroll === 'number'
  )

  const validFeeData = feeData.filter(item =>
    item &&
    item.companyName &&
    item.totalFee > 0 &&
    typeof item.totalFee === 'number'
  )

  console.log('유효한 급여 데이터:', validPayrollData.length)
  console.log('유효한 수수료 데이터:', validFeeData.length)

  // 데이터 요약 계산
  const totalPayrollCost = validPayrollData.reduce((sum, item) => sum + (item.totalPayroll || 0), 0)
  const totalFeeCost = validFeeData.reduce((sum, item) => sum + (item.totalFee || 0), 0)
  const totalLaborCost = totalPayrollCost + totalFeeCost

  console.log('비용 계산:', { totalPayrollCost, totalFeeCost, totalLaborCost })

  const payrollByDepartment = validPayrollData.reduce((acc, item) => {
    acc[item.department] = (acc[item.department] || 0) + (item.totalPayroll || 0)
    return acc
  }, {} as Record<string, number>)

  const feeByType = validFeeData.reduce((acc, item) => {
    const type = item.businessType === 'individual' ? '개인사업자' :
      item.businessType === 'contractor' ? '도급사' : '대행업체'
    acc[type] = (acc[type] || 0) + (item.totalFee || 0)
    return acc
  }, {} as Record<string, number>)

  console.log('부서별 급여:', payrollByDepartment)
  console.log('업체유형별 수수료:', feeByType)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatShortCurrency = (amount: number) => {
    if (amount >= 100000000) {
      return `₩${(amount / 100000000).toFixed(1)}억`
    } else if (amount >= 10000) {
      return `₩${(amount / 10000).toFixed(0)}만`
    } else {
      return formatCurrency(amount)
    }
  }

  return (
    <div className="space-y-6">
      {/* 데이터 상태 표시 */}
      <div className="ok-card bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 데이터 현황</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${validPayrollData.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>급여 데이터: {validPayrollData.length}건</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${validFeeData.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>수수료 데이터: {validFeeData.length}건</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">{formatShortCurrency(totalLaborCost)}</div>
            <div className="text-sm text-blue-600">총 인건비</div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'summary'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          📊 요약
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'payroll'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          👥 급여대장 ({validPayrollData.length})
        </button>
        <button
          onClick={() => setActiveTab('fee')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'fee'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          🏢 수수료 ({validFeeData.length})
        </button>
      </div>

      {/* 요약 탭 */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* KPI 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="ok-kpi-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium">총 급여비용</p>
                  <p className="text-2xl font-bold text-blue-900">{formatShortCurrency(totalPayrollCost)}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm text-blue-600 mt-2">{validPayrollData.length}명의 직원</p>
            </div>

            <div className="ok-kpi-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium">총 수수료비용</p>
                  <p className="text-2xl font-bold text-green-900">{formatShortCurrency(totalFeeCost)}</p>
                </div>
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 mt-2">{validFeeData.length}개 업체</p>
            </div>

            <div className="ok-kpi-card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 font-medium">인건비</p>
                  <p className="text-2xl font-bold text-orange-900">{formatShortCurrency(totalLaborCost)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-sm text-orange-600 mt-2">전체 비용 합계</p>
            </div>
          </div>

          {/* 데이터가 없을 때 안내 메시지 */}
          {validPayrollData.length === 0 && validFeeData.length === 0 && (
            <div className="ok-card bg-yellow-50 border-yellow-200">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-medium text-yellow-900 mb-2">데이터를 업로드해주세요</h3>
                <p className="text-yellow-700 mb-4">
                  급여대장과 수수료 파일을 업로드하면 여기에 요약 정보가 표시됩니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="font-medium mb-1">💰 급여대장 파일</p>
                    <p>이름, 부서, 직급, 기본급, 수당, 연장근무비, 연차수당, 4대보험, 상여금</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="font-medium mb-1">🏢 수수료 파일</p>
                    <p>업체명, 서비스내용, 계약금액, 수수료율, 월비용, 계약기간</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 부서별 급여 현황 */}
          {Object.keys(payrollByDepartment).length > 0 && (
            <div className="ok-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                부서별 급여 현황
              </h3>
              <div className="space-y-3">
                {Object.entries(payrollByDepartment)
                  .sort(([, a], [, b]) => b - a)
                  .map(([department, amount]) => (
                    <div key={department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{department}</span>
                      <span className="text-lg font-semibold text-blue-600">{formatShortCurrency(amount)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 업체 유형별 수수료 현황 */}
          {Object.keys(feeByType).length > 0 && (
            <div className="ok-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                업체 유형별 수수료 현황
              </h3>
              <div className="space-y-3">
                {Object.entries(feeByType)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, amount]) => (
                    <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{type}</span>
                      <span className="text-lg font-semibold text-green-600">{formatShortCurrency(amount)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 급여대장 탭 */}
      {activeTab === 'payroll' && (
        <div className="ok-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            급여대장 상세 ({validPayrollData.length}건)
          </h3>
          {validPayrollData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직원정보</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">급여내역</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총급여</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">업로드일</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {validPayrollData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.employeeName}</div>
                          <div className="text-sm text-gray-500">{item.department} • {item.position}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>기본급: {formatCurrency(item.baseSalary)}</div>
                        <div>수당: {formatCurrency(item.allowances)}</div>
                        <div>연장근무: {formatCurrency(item.overtimePay)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-blue-600">{formatShortCurrency(item.totalPayroll)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.uploadDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">급여대장 데이터가 없습니다</h3>
              <p className="text-gray-600 mb-4">엑셀 파일을 업로드하여 급여 데이터를 확인하세요</p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left text-sm text-blue-700">
                <p className="font-medium mb-2">📋 지원하는 파일 형식:</p>
                <ul className="space-y-1">
                  <li>• 이름, 부서, 직급, 기본급, 수당, 연장근무비, 연차수당, 4대보험, 상여금</li>
                  <li>• 파일명에 "급여", "직원", "인사" 등의 키워드가 포함되어야 합니다</li>
                  <li>• Excel (.xlsx, .xls) 또는 CSV 형식을 지원합니다</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 수수료 탭 */}
      {activeTab === 'fee' && (
        <div className="ok-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            수수료 상세 ({validFeeData.length}건)
          </h3>
          {validFeeData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">업체정보</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">계약내역</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수수료</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">업로드일</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {validFeeData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.companyName}</div>
                          <div className="text-sm text-gray-500">
                            {item.businessType === 'individual' ? '개인사업자' :
                              item.businessType === 'contractor' ? '도급사' : '대행업체'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{item.serviceDescription}</div>
                        <div className="text-gray-500">{item.contractPeriod}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-green-600">{formatShortCurrency(item.totalFee)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.uploadDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">수수료 데이터가 없습니다</h3>
              <p className="text-gray-600 mb-4">엑셀 파일을 업로드하여 수수료 데이터를 확인하세요</p>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-left text-sm text-green-700">
                <p className="font-medium mb-2">📋 지원하는 파일 형식:</p>
                <ul className="space-y-1">
                  <li>• 업체명, 서비스내용, 계약금액, 수수료율, 월비용, 계약기간</li>
                  <li>• 파일명에 "수수료", "도급", "대행", "계약" 등의 키워드가 포함되어야 합니다</li>
                  <li>• Excel (.xlsx, .xls) 또는 CSV 형식을 지원합니다</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
